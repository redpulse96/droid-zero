import { Body, Controller, Get, Post, Query } from '@nestjs/common';
// import { AuthGuard } from 'src/shared/guards/auth.guard';
import { BackendLogger } from '../logger/BackendLogger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/category-input.dto';

@Controller('category')
export class CategoryController {
  private readonly log = new BackendLogger(CategoryController.name);

  constructor(private readonly categoryService: CategoryService) {}

  @Post('/register')
  // @UseGuards(AuthGuard)
  public registerCategory(
    @Body('category_items') category_items: CreateCategoryDto[],
  ) {
    this.log.info('registerCategory.category_items');
    this.log.info(category_items);
    return this.categoryService.createCategory(category_items);
  }

  @Get('/fetch-by-filter')
  // @UseGuards(AuthGuard)
  public fetchCategoryListByFilter(
    @Query('name') name?: string,
    @Query('id') id?: string,
    @Query('code') code?: string,
  ) {
    const body = { id, name, code };
    this.log.info('fetchUserByFilter.body');
    this.log.info(body);
    return this.categoryService.fetchCategoryListByFilter(body);
  }

  @Post('/update-category')
  // @UseGuards(AuthGuard)
  public updateCategory(
    @Body('id') id: string,
    @Body('update_obj') update_obj: any,
  ) {
    const body = { id, update_obj };
    this.log.info('updateCategory.body');
    this.log.info(body);
    return this.categoryService.updateCategory(body);
  }
}
