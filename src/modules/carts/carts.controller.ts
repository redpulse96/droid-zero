import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { BackendLogger } from '../logger/BackendLogger';
import { CartsService } from './carts.service';

@Controller('carts')
export class CartsController {
  private readonly log = new BackendLogger(CartsController.name);

  constructor (private readonly cartsService: CartsService) { }

  @Post('/register')
  // @UseGuards(AuthGuard)
  public registerCategory(@Req() request: Request) {
    const { body, user }: any = request;
    this.log.info('registerCategory.cart_items');
    return this.cartsService.createCart({ ...body, id: user.id });
  }

  @Get('/fetch-by-filter')
  // @UseGuards(AuthGuard)
  public fetchCategoryListByFilter(
    @Req() request: Request,
    @Query('product_id') product_id?: string,
    @Query('id') id?: string,
  ) {
    const { user }: any = request;
    const body = { id, product_id, user_id: user.id };
    this.log.info('fetchUserByFilter.body');
    this.log.info(body);
    return this.cartsService.fetchCartListByFilter(body);
  }

  @Post('/update-category')
  // @UseGuards(AuthGuard)
  public updateCategory(
    @Body('id') id: string,
    @Body('update_obj') update_obj: any,
  ) {
    const body = { id, update_obj };
    this.log.info('updateCategory.body');
    this.log.info(body);
    return this.cartsService.updateCart(body);
  }
}
