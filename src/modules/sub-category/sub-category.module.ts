import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryController } from './sub-category.controller';
import { SubCategory } from './sub-category.entity';
import { SubCategoryService } from './sub-category.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SubCategory])],
  providers: [SubCategoryService],
  controllers: [SubCategoryController],
  exports: [SubCategoryService],
})
export class SubCategoryModule {}
