import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from '../products/products.entity';
import { ProductsModule } from '../products/products.module';
import { Users } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { CartsController } from './carts.controller';
import { Carts } from './carts.entity';
import { CartService } from './carts.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Carts, Products, Users]),
    ProductsModule,
    UserModule,
  ],
  providers: [CartService],
  controllers: [CartsController],
  exports: [CartService],
})
export class CartsModule {}
