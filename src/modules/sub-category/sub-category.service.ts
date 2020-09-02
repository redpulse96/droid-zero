import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import { InterfaceList, ResponseCodes, Status } from 'src/shared/constants';
import { Utils } from 'src/shared/util';
import { Repository } from 'typeorm';
import { DotenvService } from '../dotenv/dotenv.service';
import { BackendLogger } from '../logger/BackendLogger';
import {
  CreateSubCategoryDto,
  FetchSubCategoryDto,
} from './dto/sub-category-input.dto';
import { SubCategory } from './sub-category.entity';
const { executePromise, returnCatchFunction, generateRandomStr } = Utils;

@Injectable()
export class SubCategoryService extends BaseService<SubCategory> {
  private readonly log = new BackendLogger(SubCategoryService.name);

  constructor(
    @InjectRepository(SubCategory)
    private readonly subcategoryRepo: Repository<SubCategory>,
    private readonly dotenvService: DotenvService,
  ) {
    super(subcategoryRepo);
  }

  public async createSubCategory(
    sub_category_items: CreateSubCategoryDto[],
  ): Promise<InterfaceList.MethodResponse> {
    try {
      const createSubCategoryArr: any = [];
      sub_category_items.forEach((item: CreateSubCategoryDto) => {
        createSubCategoryArr.push({
          name: item.name,
          description: item.description,
          code: `${item.name
            .replace(/ /g, '_')
            .toUpperCase()}_${generateRandomStr(4)}`,
          categoryId: item.category_id ? item.category_id : null,
          status: Status.Active,
        });
      });
      const [createError, subCategories]: any[] = await executePromise(
        this.createAll(createSubCategoryArr),
      );
      if (createError) {
        this.log.error('createError');
        this.log.error(createError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!subCategories?.length) {
        this.log.info('!subCategories?.length');
        this.log.info(subCategories);
        return { response_code: ResponseCodes.SERVER_ERROR };
      }
      this.log.info('subCategories');
      this.log.info(subCategories);

      return {
        response_code: ResponseCodes.SUCCESS,
        data: { subCategories },
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

  public async fetchSubCategoryListByFilter(
    sub_category_filter: FetchSubCategoryDto,
  ): Promise<InterfaceList.MethodResponse> {
    try {
      const filter: any = { status: Status.Active };
      sub_category_filter?.id && (filter.id = sub_category_filter.id);
      sub_category_filter?.name && (filter.name = sub_category_filter.name);
      sub_category_filter?.code && (filter.code = sub_category_filter.code);
      sub_category_filter?.category_id &&
        (filter.category = sub_category_filter.category_id);

      this.log.info('fetchSubCategoryByFilter.filter');
      this.log.info(filter);
      const [subCategoryError, subCategory]: any[] = await executePromise(
        this.findAll(filter),
      );

      if (subCategoryError) {
        this.log.error('subCategoryError');
        this.log.error(subCategoryError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!subCategory?.length) {
        this.log.info('!subCategory?.length');
        this.log.info(subCategory);
        return { response_code: ResponseCodes.BAD_REQUEST };
      }
      this.log.info('subCategory');
      this.log.info(subCategory);

      return {
        response_code: ResponseCodes.SUCCESSFUL_FETCH,
        data: { subCategory },
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }
}
