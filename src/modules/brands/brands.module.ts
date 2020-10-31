import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsController } from './brands.controller';
import { Brands } from './brands.entity';
import { BrandsService } from './brands.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Brands])],
  exports: [BrandsService],
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
