import { Body, Controller, Get, Post, Query } from '@nestjs/common';
// import { AuthGuard } from 'src/shared/guards/auth.guard';
import { BackendLogger } from '../logger/BackendLogger';
import { CreateProductsDto } from './dto/products-input.dto';
import { ProductService } from './products.service';

@Controller('products')
export class ProductsController {
  private readonly log = new BackendLogger(ProductsController.name);

  constructor (private readonly productService: ProductService) { }

  @Post('/register')
  // @UseGuards(AuthGuard)
  public registerProducts(
    @Body('product_items') product_items: CreateProductsDto[],
  ) {
    this.log.info('---registerProducts.product_items---');
    this.log.info(product_items);
    return this.productService.createProducts(product_items);
  }

  @Get('/fetch-by-filter')
  // @UseGuards(AuthGuard)
  public fetchProductListByFilter(
    @Query('name') name?: string,
    @Query('id') id?: string,
    @Query('code') code?: string,
  ) {
    const body = { id, name, code };
    this.log.info('---fetchProductListByFilter.body---');
    this.log.info(body);
    return this.productService.fetchProductListByFilter(body);
  }
}
