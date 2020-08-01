import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from './sub-category.entity';
import { SubCategoryService } from './sub-category.service';

describe('SubCategoryService', () => {
  let subCategoryService: SubCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([SubCategory])],
      providers: [SubCategoryService],
    }).compile();

    subCategoryService = module.get<SubCategoryService>(SubCategoryService);
  });

  it('should be defined', () => {
    expect(subCategoryService).toBeDefined();
  });
});
