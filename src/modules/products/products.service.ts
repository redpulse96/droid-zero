import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import { InterfaceList, ResponseCodes, Status } from 'src/shared/constants';
import { Utils } from 'src/shared/util';
import { Repository } from 'typeorm';
import { DotenvService } from '../dotenv/dotenv.service';
import { BackendLogger } from '../logger/BackendLogger';
import {
  CreateProductsDto,
  FetchProductDetailsDto,
} from './dto/products-input.dto';
import { Products } from './products.entity';
const { executePromise, returnCatchFunction, generateRandomStr } = Utils;

@Injectable()
export class ProductService extends BaseService<Products> {
  private readonly log = new BackendLogger(ProductService.name);

  constructor(
    @InjectRepository(Products)
    private readonly productsRepo: Repository<Products>,
    private readonly dotenvService: DotenvService,
  ) {
    super(productsRepo);
  }

  public async createProducts(
    product_items: CreateProductsDto[],
  ): Promise<InterfaceList.MethodResponse> {
    try {
      const createProductsArr: any = [];
      product_items.forEach((item: CreateProductsDto) => {
        createProductsArr.push({
          name: item.name,
          description: item.description,
          category: item?.category_id || undefined,
          subcategory: item?.subcategory_id || undefined,
          code: `${item.name
            .replace(' ', '_')
            .toUpperCase()}${generateRandomStr(4)}`,
          status: Status.Active,
        });
      });
      this.log.info(this.dotenvService);
      const [createError, products]: any[] = await executePromise(
        this.create(createProductsArr),
      );
      if (createError) {
        this.log.error('createError');
        this.log.error(createError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!products?.length) {
        this.log.info('!products?.length');
        return { response_code: ResponseCodes.SERVER_ERROR };
      }
      this.log.info('---products---');
      this.log.info(products);
      return {
        response_code: ResponseCodes.SUCCESS,
        data: { products },
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

  public async fetchProductListByFilter(
    products_filter: FetchProductDetailsDto,
  ): Promise<InterfaceList.MethodResponse> {
    try {
      const filter: any = {
        id: products_filter?.id ? products_filter.id : undefined,
        name: products_filter?.name ? products_filter.name : undefined,
        category: products_filter?.category_id
          ? products_filter.category_id
          : undefined,
        subcategory: products_filter?.subcategory_id
          ? products_filter.subcategory_id
          : undefined,
        code: products_filter?.code ? products_filter.code : undefined,
        status: Status.Active,
      };
      this.log.info('fetchProductListByFilter.filter');
      this.log.info(filter);
      const [productsError, products]: any[] = await executePromise(
        this.findAll(filter),
      );
      if (productsError) {
        this.log.error('productsError');
        this.log.error(productsError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!products?.length) {
        this.log.info('!products?.length');
        return { response_code: ResponseCodes.BAD_REQUEST };
      }
      this.log.info('products');
      this.log.info(products);
      return {
        response_code: ResponseCodes.SUCCESSFUL_FETCH,
        data: { products },
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }
}
