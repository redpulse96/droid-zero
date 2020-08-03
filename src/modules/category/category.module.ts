import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from '../sub-category/sub-category.entity';
import { SubCategoryModule } from '../sub-category/sub-category.module';
import { CategoryController } from './category.controller';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Category, SubCategory]),
    SubCategoryModule,
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
