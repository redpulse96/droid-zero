import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import {
  InterfaceList,
  PaymentModes,
  ResponseCodes,
  Status,
} from 'src/shared/constants';
import { Repository } from 'typeorm';
import { Utils } from '../../shared/util';
import { Carts } from '../carts/carts.entity';
import { CartService } from '../carts/carts.service';
import { DotenvService } from '../dotenv/dotenv.service';
import { BackendLogger } from '../logger/BackendLogger';
import { CreatePaymentDto } from '../payments/dto/payments-input.dto';
import { PaymentsService } from '../payments/payments.service';
import { ProductService } from '../products/products.service';
import { CreateOrdersDto, FetchOrdersDto } from './dto/order-inputs.dto';
import { Orders } from './orders.entity';
const { executePromise, generateReferenceID, returnCatchFunction } = Utils;
@Injectable()
export class OrderService extends BaseService<Orders> {
  private readonly log = new BackendLogger(OrderService.name);

  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepo: Repository<Orders>,
    private readonly dotenvService: DotenvService,
    private readonly productService: ProductService,
    private readonly paymentsService: PaymentsService,
    private readonly cartService: CartService,
  ) {
    super(ordersRepo);
  }

  async checkout(input: any): Promise<InterfaceList.MethodResponse> {
    const filter: Partial<Carts> = {
      user: input.id,
      status: Status.Active,
    };
    const [cart_error, cart_details]: any[] = await executePromise(
      this.cartService.findAll(filter, ['product']),
    );
    if (cart_error) {
      this.log.error('cart_error', cart_error);
      return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
    } else if (!cart_details?.length) {
      this.log.info('!cart_details?.length');
      return { response_code: ResponseCodes.BAD_REQUEST };
    }
    this.log.info('cart_details');
    this.log.debug(cart_details);
    const resp: any = {
      total_amount: 0,
      total_quantity: 0,
      tax_components: [],
      discount_components: [],
      orders: [],
    };
    cart_details.map((val: Carts) => {
      if (val.product) {
        const obj: any = {
          name: val.product.name,
          description: val.product.description,
          quantity: val.quantity,
          total_amount: val.product.total_amount * val.quantity,
        };
        resp.total_amount += obj.total_amount;
        resp.total_quantity += obj.quantity;
        if (val.product.is_tax_applicable) {
          resp.tax_components.push({
            is_tax_applicable: true,
            tax_value: val.product.tax_value,
            tax_slab: 'GST (CGST + SCGT)',
            tax_amount: val.product.tax_value * val.quantity,
            tax_type: val.product.tax_type,
          });
        }
        resp.orders.push(obj);
      }
    });
    this.log.info('resp');
    this.log.debug(resp);
    return {
      response_code: ResponseCodes.SUCCESS,
      data: { ...resp },
    };
  }

  async fetchOrderListByFilter(
    filter: FetchOrdersDto,
  ): Promise<InterfaceList.MethodResponse> {
    return { response_code: ResponseCodes.SUCCESS };
  }

  async checkInventory(
    filter: FetchOrdersDto,
  ): Promise<InterfaceList.MethodResponse> {
    try {
      const resp: any = {};
      const cart_details: Carts[] = await this.cartService.findAll(
        { user: filter.id },
        ['product'],
      );
      if (!cart_details?.length) {
        this.log.error('CART.EMPTY');
        return { response_code: ResponseCodes.BAD_REQUEST };
      }
      this.log.info('cart_details.length');
      this.log.debug(cart_details);
      cart_details.map((val: Carts) => {
        if (val.product) {
          let remaining_quantity: number = val.product.maximum_allowed_quantity;
          if (val.quantity < remaining_quantity) {
            remaining_quantity = val.quantity;
          }
          resp[val.product.id] = remaining_quantity;
        }
      });
      return {
        response_code: ResponseCodes.SUCCESS,
        data: { ...resp },
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

  async createOrder(
    order_details: CreateOrdersDto,
  ): Promise<InterfaceList.MethodResponse> {
    try {
      const is_online_payment: boolean = [PaymentModes.ONLINE].includes(
        order_details.mode_of_payment,
      );
      if (is_online_payment && !order_details.payment_id) {
        this.log.error('pass.payment.id');
        return { response_code: ResponseCodes.BAD_REQUEST };
      }
      const { payment_id, amount, notes } = order_details;
      const payment_obj: CreatePaymentDto = { payment_id, amount, notes };
      const payment_details: any = await this.paymentsService.createPaymentInstance(
        payment_obj,
      );
      if (!payment_details.success) {
        this.log.error('!payment_details.success');
        return { response_code: ResponseCodes.FAILURE };
      }
      this.log.info('payment.successfully.captured');

      const cart_details: any = await this.cartService.fetchCartListByFilter({
        user_id: order_details.id,
      });
      if (!cart_details?.data?.length) {
        this.log.error('CARTS.EMTPY');
        return { response_code: ResponseCodes.BAD_REQUEST };
      }
      const create_order_obj: any = {
        payment_id,
        total_amount: amount,
        mobile_number: order_details.mobile_number,
        created_by: order_details.id,
        remarks: order_details.remarks,
        reference_id: generateReferenceID(),
        status: Status.Completed,
        price_components: [],
        payment_mode: is_online_payment
          ? PaymentModes.ONLINE
          : PaymentModes.CASH,
      };
      cart_details.data.map((val: any) => {
        if (val.product) {
          const product_obj = { ...val.product };
          create_order_obj.price_components.push({
            name: product_obj.tax_type,
            description: product_obj.tax_type,
            type: product_obj.tax_type,
            is_tax_applicable: product_obj.is_tax_applicable,
            base_value: product_obj.base_price,
            final_value: product_obj.total_amount,
            status: Status.Active,
          });
        }
      });
      const create_order: Orders = await this.create(create_order_obj);
      if (!create_order) {
        this.log.error('order.cannot.be.created');
        const request_refund_obj: CreatePaymentDto = {
          payment_id,
          amount,
          notes,
        };
        await this.paymentsService.requestRefund(request_refund_obj);
        return { response_code: ResponseCodes.FAILURE };
      }
      this.log.info('create_order');
      this.log.debug(create_order);

      if (create_order_obj?.price_components?.length) {
        const update_quantity_obj: any = create_order_obj.price_components.map(
          (val: any) => {
            return {
              product_id: val.product_id,
              ordered_quantity: val.ordered_quantity,
            };
          },
        );
        this.productService.updateQuantity(update_quantity_obj);
      }

      return {
        response_code: ResponseCodes.SUCCESS,
        data: { ...create_order },
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }
}
