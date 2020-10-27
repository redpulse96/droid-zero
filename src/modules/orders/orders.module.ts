import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { Orders } from './orders.entity';
import { OrdersService } from './orders.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Orders])],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
