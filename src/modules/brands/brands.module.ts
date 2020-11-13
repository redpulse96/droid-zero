import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsController } from './brands.controller';
import { Brands } from './brands.entity';
import { BrandService } from './brands.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Brands])],
  exports: [BrandService],
  controllers: [BrandsController],
  providers: [BrandService],
})
export class BrandsModule {}
