import { Body, Controller, Get, Post, Query } from '@nestjs/common';
// import { AuthGuard } from 'src/shared/guards/auth.guard';
import { BackendLogger } from '../logger/BackendLogger';
import { CreateOrdersDto } from './dto/order-inputs.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  private readonly log = new BackendLogger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Post('/register')
  // @UseGuards(AuthGuard)
  public registerOrder(@Body('order_items') order_items: CreateOrdersDto) {
    this.log.info('registerOrders.order_items');
    this.log.info(order_items);
    return this.ordersService.createOrder(order_items);
  }

  @Get('/fetch-by-filter')
  // @UseGuards(AuthGuard)
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
}
