import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import { InterfaceList, ResponseCodes } from 'src/shared/constants';
import { Repository } from 'typeorm';
import { DotenvService } from '../dotenv/dotenv.service';
import { BackendLogger } from '../logger/BackendLogger';
import { CreateOrdersDto, FetchOrdersDto } from './dto/order-inputs.dto';
import { Orders } from './orders.entity';

@Injectable()
export class OrdersService extends BaseService<Orders> {
  private readonly log = new BackendLogger(OrdersService.name);

  constructor (
    @InjectRepository(Orders)
    private readonly categoryRepo: Repository<Orders>,
    private readonly dotenvService: DotenvService,
  ) {
    super(categoryRepo);
  }

  async createOrder(order_details: CreateOrdersDto): Promise<InterfaceList.MethodResponse> {
    return { response_code: ResponseCodes.SUCCESS };
  }

  async fetchOrderListByFilter(filter: FetchOrdersDto): Promise<InterfaceList.MethodResponse> {
    return { response_code: ResponseCodes.SUCCESS };
  }

}
