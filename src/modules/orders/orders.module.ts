import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { Orders } from './orders.entity';
import { OrderService } from './orders.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Orders])],
  providers: [OrderService],
  controllers: [OrdersController],
  exports: [OrderService],
})
export class OrdersModule {}
