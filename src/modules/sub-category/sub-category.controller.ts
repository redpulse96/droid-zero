import { Body, Controller, Get, Post, Query } from '@nestjs/common';
// import { AuthGuard } from 'src/shared/guards/auth.guard';
import { BackendLogger } from '../logger/BackendLogger';
import { CreateSubCategoryDto } from './dto/sub-category-input.dto';
import { SubCategoryService } from './sub-category.service';

@Controller('sub-category')
export class SubCategoryController {
  private readonly log = new BackendLogger(SubCategoryController.name);

  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Post('/register')
  // @UseGuards(AuthGuard)
  public registerSubCategory(
    @Body('sub_category_items') sub_category_items: CreateSubCategoryDto[],
  ) {
    this.log.info('registerSubCategory.sub_category_items');
    this.log.info(sub_category_items);
    return this.subCategoryService.createSubCategory(sub_category_items);
  }

  @Get('/fetch-by-filter')
  // @UseGuards(AuthGuard)
  public fetchSubCategoryByFilter(
    @Query('id') id?: string,
    @Query('name') name?: string,
    @Query('code') code?: string,
  ) {
    const body = { id, name, code };
    this.log.info('fetchSubCategoryByFilter.body');
    this.log.info(body);
    return this.subCategoryService.fetchSubCategoryListByFilter(body);
  }
}
