import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import { InterfaceList, ResponseCodes, Status } from 'src/shared/constants';
import { Utils } from 'src/shared/util';
import { In, Repository } from 'typeorm';
import { DotenvService } from '../dotenv/dotenv.service';
import { BackendLogger } from '../logger/BackendLogger';
import { Carts } from './carts.entity';
import {
  CreateCartDto,
  FetchCartDto,
  UpdateCartDto,
} from './dto/carts-input.dto';
const { executePromise, returnCatchFunction } = Utils;

@Injectable()
export class CartService extends BaseService<Carts> {
  private readonly log = new BackendLogger(CartService.name);

  constructor(
    @InjectRepository(Carts)
    private readonly cartsRepo: Repository<Carts>,
    private readonly dotenvService: DotenvService,
  ) {
    super(cartsRepo);
  }

  public async createCart(
    cart_input: CreateCartDto,
  ): Promise<InterfaceList.MethodResponse> {
    try {
      const filter: any = {
        product: cart_input.product_id,
        user: cart_input.user_id,
      };
      const createObj: any = {
        product: cart_input.product_id,
        user: cart_input.user_id,
        quantity: cart_input.quantity,
        status: Status.Active,
      };
      const [cartsError, carts]: any[] = await executePromise(
        this.updateOrCreate(filter, createObj),
      );
      if (cartsError) {
        this.log.error('cartsError', cartsError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!carts) {
        this.log.error('!carts?.length');
        return { response_code: ResponseCodes.EMPTY_RESPONSE };
      }
      this.log.info('carts');
      this.log.debug(carts);
      return {
        response_code: ResponseCodes.SUCCESS,
        data: { ...carts },
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

  public async fetchCartListByFilter(
    cart_filter: FetchCartDto,
  ): Promise<InterfaceList.MethodResponse> {
    try {
      const filter: any = { status: Status.Active };
      cart_filter?.id?.length && (filter.id = In([].concat(cart_filter.id)));
      cart_filter?.product_id && (filter.product = cart_filter.product_id);
      cart_filter?.user_id && (filter.user = cart_filter.user_id);
      this.log.info('fetchCartListByFilter.filter');
      this.log.info(filter);
      const [cartError, carts]: any[] = await executePromise(
        this.findAll(filter, ['product']),
      );
      if (cartError) {
        this.log.error('cartError', cartError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!carts?.length) {
        this.log.info('!carts?.length');
        return { response_code: ResponseCodes.BAD_REQUEST };
      }
      this.log.info('carts');
      this.log.debug(carts);
      return {
        response_code: ResponseCodes.SUCCESSFUL_FETCH,
        data: { carts },
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

  public async updateCart(
    data: UpdateCartDto,
  ): Promise<InterfaceList.MethodResponse> {
    try {
      const [cartError, cart]: any[] = await executePromise(
        this.findOne({
          id: data.id,
          status: Status.Active,
        }),
      );
      if (cartError) {
        this.log.error('cartError', cartError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!cart?.id) {
        this.log.info('cart.not.exist');
        return { response_code: ResponseCodes.EMPTY_RESPONSE };
      }
      this.log.info('cart');
      this.log.info(cart);

      // TODO: ADD FILE UPLOADING OPTION
      const [updateCartError, updateCart]: any[] = await executePromise(
        this.update({ id: data.id }, data.update_obj),
      );
      if (updateCartError) {
        this.log.error('updateCartError', updateCartError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      }
      this.log.info('updateCart');
      this.log.info(updateCart);
      return { response_code: ResponseCodes.UPDATE_SUCCESSFUL };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

  public async deleteCart(id: string): Promise<InterfaceList.MethodResponse> {
    try {
      const [cartError, deletedCart]: any[] = await executePromise(
        this.delete({ id }),
      );
      if (cartError) {
        this.log.error('cartError', cartError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      }
      this.log.info('deletedCart');
      this.log.info(deletedCart);
      return { response_code: ResponseCodes.UPDATE_SUCCESSFUL };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }
}
