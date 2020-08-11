import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BackendLogger } from '../logger/BackendLogger';
import { CreatePricingsDto } from './dto/pricings-input.dto';
import { PricingsService } from './pricings.service';

@Controller('pricings')
export class PricingsController {
  private readonly log = new BackendLogger(PricingsController.name);

  constructor (private readonly pricingService: PricingsService) { }

  @Post('/register')
  // @UseGuards(AuthGuard)
  public registerPricings(
    @Body('pricing_items') pricing_items: CreatePricingsDto[],
  ) {
    this.log.info('---registerPricings.pricing_items---');
    this.log.info(pricing_items);
    return this.pricingService.createPricings(pricing_items);
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
    return this.pricingService.fetchProductListByFilter(body);
  }

}
