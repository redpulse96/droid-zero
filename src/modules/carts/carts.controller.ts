import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { BackendLogger } from '../logger/BackendLogger';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/carts-input.dto';

@Controller('carts')
export class CartsController {
  private readonly log = new BackendLogger(CartsController.name);

  constructor(private readonly cartsService: CartsService) {}

  @Post('/register')
  // @UseGuards(AuthGuard)
  public registerCategory(
    @Body('cart_items') cart_items: CreateCartDto,
    @Req() request: Request,
  ) {
    const { body, user }: any = request;
    this.log.info('registerCategory.cart_items');
    this.log.info(cart_items);
    return this.cartsService.createCart(body.cart_items, user.id);
  }

  @Get('/fetch-by-filter')
  // @UseGuards(AuthGuard)
  public fetchCategoryListByFilter(
    @Query('name') name?: string,
    @Query('id') id?: string,
    @Query('code') code?: string,
  ) {
    const body = { id, name, code };
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
