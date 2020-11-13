import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BackendLogger } from '../logger/BackendLogger';
import { BrandService } from './brands.service';

@Controller('brands')
export class BrandsController {
  private readonly log = new BackendLogger(BrandsController.name);

  constructor(private readonly brandService: BrandService) {}

  @Post('/register')
  // @UseGuards(AuthGuard)
  public registerBrands(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('code') code?: string,
  ) {
    this.log.info('registerBrands.brands_items');
    return this.brandService.createBrands({ name, description, code });
  }

  @Get('/fetch-by-filter')
  // @UseGuards(AuthGuard)
  public fetchBrandsListByFilter(
    @Query('name') name?: string,
    @Query('id') id?: string,
    @Query('code') code?: string,
  ) {
    const body = { id, name, code };
    this.log.info('fetchUserByFilter.body');
    this.log.info(body);
    return this.brandService.fetchBrandsListByFilter(body);
  }

  @Post('/update-brand')
  // @UseGuards(AuthGuard)
  public updateBrands(
    @Body('id') id: string,
    @Body('update_obj') update_obj: any,
  ) {
    const body = { id, update_obj };
    this.log.info('updateBrands.body');
    this.log.info(body);
    return this.brandService.updateBrands(body);
  }
}
