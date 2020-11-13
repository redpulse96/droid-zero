import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { BackendLogger } from '../logger/BackendLogger';
import { CreateOrdersDto } from './dto/order-inputs.dto';
import { OrderService } from './orders.service';

@Controller('orders')
export class OrdersController {
  private readonly log = new BackendLogger(OrdersController.name);

  constructor(private readonly ordersService: OrderService) {}

  @Post('/register')
  // @UseGuards(AuthGuard)
  public registerOrder(@Body('order_items') order_items: CreateOrdersDto) {
    this.log.info('registerOrders.order_items');
    this.log.info(order_items);
    return this.ordersService.createOrder(order_items);
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
    const { user }: any = request;
    this.log.info('fetchOrderListByFilter.body');
    return this.ordersService.checkout({ id: user.id });
  }

  @Get('/inventory/check')
  // @UseGuards(AuthGuard)
  public checkInventory(@Query('id') id?: string) {
    const body = { id };
    this.log.info('fetchOrderListByFilter.body');
    this.log.debug(body);
    return this.ordersService.checkInventory(body);
  }
}
