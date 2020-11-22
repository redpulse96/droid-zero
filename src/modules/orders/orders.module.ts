import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartsModule } from '../carts/carts.module';
import { PaymentsModule } from '../payments/payments.module';
import { ProductsModule } from '../products/products.module';
import { OrdersController } from './orders.controller';
import { Orders } from './orders.entity';
import { OrderService } from './orders.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Orders]),
    PaymentsModule,
    ProductsModule,
    CartsModule,
  ],
  providers: [OrderService],
  controllers: [OrdersController],
  exports: [OrderService],
})
export class OrdersModule {}
