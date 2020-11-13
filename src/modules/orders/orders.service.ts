import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import { InterfaceList, ResponseCodes, Status } from 'src/shared/constants';
import { Repository } from 'typeorm';
import { Utils } from '../../shared/util';
import { Carts } from '../carts/carts.entity';
import { CartService } from '../carts/carts.service';
import { DotenvService } from '../dotenv/dotenv.service';
import { BackendLogger } from '../logger/BackendLogger';
import { ProductService } from '../products/products.service';
import { CreateOrdersDto, FetchOrdersDto } from './dto/order-inputs.dto';
import { Orders } from './orders.entity';
const { executePromise } = Utils;
@Injectable()
export class OrderService extends BaseService<Orders> {
  private readonly log = new BackendLogger(OrderService.name);

  constructor (
    @InjectRepository(Orders)
    private readonly ordersRepo: Repository<Orders>,
    private readonly dotenvService: DotenvService,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
  ) {
    super(ordersRepo);
  }

  async createOrder(
    order_details: CreateOrdersDto,
  ): Promise<InterfaceList.MethodResponse> {
    return { response_code: ResponseCodes.SUCCESS };
  }

  async fetchOrderListByFilter(
    filter: FetchOrdersDto,
  ): Promise<InterfaceList.MethodResponse> {
    return { response_code: ResponseCodes.SUCCESS };
  }

  async checkInventory(
    filter: FetchOrdersDto,
  ): Promise<InterfaceList.MethodResponse> {
    return { response_code: ResponseCodes.SUCCESS };
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
      orders: []
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
}
