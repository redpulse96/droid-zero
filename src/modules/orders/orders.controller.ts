import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { BackendLogger } from '../logger/BackendLogger';
import { OrderService } from './orders.service';

@Controller('orders')
export class OrdersController {
  private readonly log = new BackendLogger(OrdersController.name);

  constructor(private readonly ordersService: OrderService) {}

  @Post('/register')
  // @UseGuards(AuthGuard)
  public registerOrder(@Req() request: Request) {
    const { body, user }: any = request;
    this.log.info('registerOrders.order_items');
    this.log.debug(body);
    return this.ordersService.createOrder({ ...user, ...body });
  }

  @Get('/fetch-by-filter')
  @UseGuards(AuthGuard)
  public fetchOrderListByFilter(
    @Query('name') name?: string,
    @Query('id') id?: string,
    @Query('code') code?: string,
  ) {
    const body = { id, name, code };
    this.log.info('fetchOrderListByFilter.body');
    this.log.info(body);
    return this.ordersService.fetchOrderListByFilter(body);
  }

  @Get('/checkout')
  // @UseGuards(AuthGuard)
  public checkout(@Req() request: Request) {
    const { body, user }: any = request;
    this.log.info('fetchOrderListByFilter.body');
    return this.ordersService.checkout({
      ...body,
      ...user,
    });
  }

  @Get('/inventory/check')
  // @UseGuards(AuthGuard)
  public checkInventory(@Req() request: Request) {
    const { user }: any = request;
    const { id } = user;
    this.log.info('checkInventory.user');
    this.log.debug(user);
    return this.ordersService.checkInventory({ id });
  }
}
