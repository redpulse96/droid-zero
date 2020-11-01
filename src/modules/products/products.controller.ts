import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
// import { AuthGuard } from 'src/shared/guards/auth.guard';
import { BackendLogger } from '../logger/BackendLogger';
import { CreateProductsDto } from './dto/products-input.dto';
import { ProductService } from './products.service';
@Controller('products')
export class ProductsController {
  private readonly log = new BackendLogger(ProductsController.name);

  constructor(private readonly productService: ProductService) {}

  @Post('/register')
  // @UseGuards(AuthGuard)
  public registerProduct(
    @Body('name') name: string,
    @Body('category_id') category_id: string,
    @Body('description') description: string,
    @Body('base_price') base_price: number,
    @Body('tax_value') tax_value: number,
    @Body('tax_type') tax_type: string,
    @Body('available_quantity') available_quantity: number,
    @Body('brand_id') brand_id: string,
  ) {
    this.log.info('registerProducts.product_items');
    const product_items: CreateProductsDto = {
      name,
      category_id,
      description,
      base_price,
      tax_value,
      tax_type,
      available_quantity,
      brand_id,
    };
    return this.productService.createProduct(product_items);
  }

  @Get('/fetch-by-filter')
  // @UseGuards(AuthGuard)
  public fetchProductListByFilter(
    @Query('id') id?: string,
    @Query('brand_id') brand_id?: string,
    @Query('category_id') category_id?: string,
    @Query('name') name?: string,
    @Query('code') code?: string,
  ) {
    const body = { id, brand_id, name, category_id, code };
    this.log.info('fetchProductListByFilter.body');
    this.log.info(body);
    return this.productService.fetchProductListByFilter(body);
  }

  @Get('/fetch-product-details')
  // @UseGuards(AuthGuard)
  public fetchProductDetails(@Req() request: Request) {
    const { user, query }: any = request;
    this.log.info('fetchProductListByFilter.body');
    return this.productService.fetchProductDetails({
      user,
      product_id: query.product_id,
    });
  }
}
