import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { BackendLogger } from '../logger/BackendLogger';
import { CartService } from './carts.service';

@Controller('carts')
export class CartsController {
  private readonly log = new BackendLogger(CartsController.name);

  constructor(private readonly cartsService: CartService) {}

  @Post('/register')
  // @UseGuards(AuthGuard)
  public registerCart(@Req() request: Request) {
    const { body, user }: any = request;
    this.log.info('registerCart.cart_items');
    return this.cartsService.createCart({ ...body, user_id: user.id });
  }

  @Get('/fetch-by-filter')
  // @UseGuards(AuthGuard)
  public fetchCartListByFilter(
    @Req() request: Request,
    @Query('product_id') product_id?: string,
    @Query('id') id?: string,
  ) {
    const { user }: any = request;
    const body = { id, product_id, user_id: user.id };
    this.log.info('fetchCartListByFilter.body');
    this.log.info(body);
    return this.cartsService.fetchCartListByFilter(body);
  }

  @Post('/delete-cart')
  // @UseGuards(AuthGuard)
  public deleteCart(@Body('id') id: string) {
    this.log.info('deleteCart.body');
    this.log.info(id);
    return this.cartsService.deleteCart(id);
  }

  @Post('/update-cart')
  // @UseGuards(AuthGuard)
  public updateCart(
    @Body('id') id: string,
    @Body('update_obj') update_obj: any,
  ) {
    const body = { id, update_obj };
    this.log.info('updateCart.body');
    this.log.info(body);
    return this.cartsService.updateCart(body);
  }
}
