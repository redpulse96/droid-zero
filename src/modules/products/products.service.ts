import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import { InterfaceList, ResponseCodes, Status } from 'src/shared/constants';
import { Utils } from 'src/shared/util';
import { Repository } from 'typeorm';
import { DotenvService } from '../dotenv/dotenv.service';
import { BackendLogger } from '../logger/BackendLogger';
import { CreatePricingsDto } from '../pricings/dto/pricings-input.dto';
import { PricingsService } from '../pricings/pricings.service';
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
    private readonly pricingService: PricingsService,
    private readonly dotenvService: DotenvService,
  ) {
    super(productsRepo);
  }

  public async createProduct(
    product_items: CreateProductsDto,
  ): Promise<InterfaceList.MethodResponse> {
    try {
      const priceList: CreatePricingsDto[] = [];
      const createProductsObj: any = {
        name: product_items.name,
        description: product_items.description,
        category: product_items?.category_id || undefined,
        subcategory: product_items?.subcategory_id || undefined,
        code: `${product_items.name
          .replace(' ', '_')
          .toUpperCase()}${generateRandomStr(4)}`,
        status: Status.Active,
      };

      const [createError, product]: any[] = await executePromise(
        this.create(createProductsObj),
      );
      if (createError) {
        this.log.error('createError');
        this.log.error(createError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!product?.length) {
        this.log.info('!product?.length');
        return { response_code: ResponseCodes.SERVER_ERROR };
      }
      this.log.info('product');
      this.log.info(product);

      product_items.prices.forEach((item: CreateProductsDto) => {
        if (item.prices?.length) {
          item.prices.forEach((item: CreatePricingsDto) => {
            priceList.push({
              ...item,
              productId: product.id,
            });
          });
        }
      });

      const [priceError, prices]: any[] = await executePromise(
        this.pricingService.createPricings(priceList),
      );
      if (priceError) {
        this.log.error('priceError');
        this.log.error(priceError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!prices?.totalAmount) {
        this.log.info('!prices?.totalAmount');
        return { response_code: ResponseCodes.FAILURE };
      }
      this.log.error('prices.totalAmount');
      this.log.error(prices);

      const [updateProductError, updateProduct]: any[] = await executePromise(
        this.update(
          {
            id: product.id,
          },
          {
            total_amount: prices.totalAmount,
          },
        ),
      );
      if (updateProductError) {
        this.log.error('priceError');
        this.log.error(priceError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!updateProduct) {
        this.log.info('!updateProduct');
        return { response_code: ResponseCodes.FAILURE };
      }
      this.log.info('updateProduct');
      this.log.info(updateProduct);
      return {
        response_code: ResponseCodes.SUCCESS,
        data: { updateProduct },
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
        this.findAll(filter, ['prices']),
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
