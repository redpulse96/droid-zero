import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import { ImagesPath, InterfaceList, ResponseCodes, Status } from 'src/shared/constants';
import { Utils } from 'src/shared/util';
import { In, Repository } from 'typeorm';
import { DotenvService } from '../dotenv/dotenv.service';
import { BackendLogger } from '../logger/BackendLogger';
import { Category } from './category.entity';
import { CreateCategoryDto, FetchCategoryDto, UpdateCategoryDto } from './dto/category-input.dto';
const {
  executePromise,
  returnCatchFunction,
  generateRandomStr,
} = Utils;

@Injectable()
export class CategoryService extends BaseService<Category> {
  private readonly log = new BackendLogger(CategoryService.name);

  constructor (
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly dotenvService: DotenvService,
  ) {
    super(categoryRepo);
  }

  public async createCategory(category_array: CreateCategoryDto[]): Promise<InterfaceList.MethodResponse> {
    try {
      const createArray: any = [];
      category_array.forEach((val: CreateCategoryDto) => {
        createArray.push({
          name: val.name,
          description: val.description,
          code: `${val.name.replace(/ /g, '_').toUpperCase()}${generateRandomStr(4)}`,
          image_path: `${this.dotenvService.get('IMAGES_PATH')}${ImagesPath.Category}${val.name.replace(' ', '_').toUpperCase()}`,
          status: Status.Active
        });
      });
      this.log.info(this.dotenvService);
      const [categoriesError, categories]: any[] = await executePromise(this.createAll(createArray));
      if (categoriesError) {
        this.log.error('categoriesError');
        this.log.error(categoriesError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!categories?.length) {
        this.log.error('!categories?.length');
        return { response_code: ResponseCodes.EMPTY_RESPONSE };
      }
      this.log.info('categories');
      this.log.info(categories);
      return {
        response_code: ResponseCodes.SUCCESS,
        data: { categories }
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

  public async fetchCategoryListByFilter(category_filter: FetchCategoryDto): Promise<InterfaceList.MethodResponse> {
    try {
      const filter: any = { status: Status.Active };
      category_filter?.id?.length && (filter.id = In([].concat(category_filter.id)));
      category_filter?.name && (filter.name = category_filter.name);
      category_filter?.code && (filter.code = category_filter.code);
      this.log.info('fetchCategoryListByFilter.filter');
      this.log.info(filter);
      const [categoryError, categories]: any[] = await executePromise(this.findAll(filter));
      if (categoryError) {
        this.log.error('categoryError');
        this.log.error(categoryError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!categories?.length) {
        this.log.info('!categories?.length');
        return { response_code: ResponseCodes.BAD_REQUEST };
      }
      this.log.info('categories');
      this.log.info(categories);
      return {
        response_code: ResponseCodes.SUCCESSFUL_FETCH,
        data: { categories }
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

  public async updateCategory(data: UpdateCategoryDto): Promise<InterfaceList.MethodResponse> {
    try {
      const [categoryError, category]: any[] = await executePromise(this.findOne({
        id: data.id,
        status: Status.Active
      }));
      if (categoryError) {
        this.log.error('categoryError');
        this.log.error(categoryError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!category?.id) {
        this.log.info('category.not.exist');
        return { response_code: ResponseCodes.EMPTY_RESPONSE };
      }
      this.log.info('category');
      this.log.info(category);

      // TODO: ADD FILE UPLOADING OPTION
      const [updateCategoryError, updateCategory]: any[] = await executePromise(this.update({ id: data.id }, data.update_obj));
      if (updateCategoryError) {
        this.log.error('updateCategoryError');
        this.log.error(updateCategoryError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      }
      this.log.info('updateCategory');
      this.log.info(updateCategory);
      return { response_code: ResponseCodes.UPDATE_SUCCESSFUL };
    } catch (error) {
      return returnCatchFunction(error);
    }
  };
}
