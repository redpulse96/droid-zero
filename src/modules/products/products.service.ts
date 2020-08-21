import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import {
  InterfaceList,
  ResponseCodes,
  Status,
  TaxType,
} from 'src/shared/constants';
import { Utils } from 'src/shared/util';
import { Repository } from 'typeorm';
import { DotenvService } from '../dotenv/dotenv.service';
import { BackendLogger } from '../logger/BackendLogger';
import {
  CreatePricingsDto,
  CreateProductsDto,
  FetchProductDetailsDto,
} from './dto/products-input.dto';
import { Products } from './products.entity';

const { executePromise, returnCatchFunction, generateRandomStr } = Utils;
const { Absolute, Discount, DiscountPercentage, Percentage } = TaxType;

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

  private calculateTaxValue(
    taxType: string,
    taxValue: number,
    baseValue: number,
  ): string {
    switch (taxType) {
      case Percentage:
        return (baseValue + baseValue * (taxValue / 100)).toString();
      case Absolute:
        return taxValue.toString();
      case DiscountPercentage:
        return (baseValue - baseValue * (taxValue / 100)).toString();
      case Discount:
        return (baseValue - taxValue).toString();
      default:
        return baseValue.toString();
    }
  }

  public async createProduct(
    product_items: CreateProductsDto,
  ): Promise<InterfaceList.MethodResponse> {
    try {
      const createProductsObj: any = {
        name: product_items.name,
        description: product_items.description,
        category: product_items?.category_id || null,
        subcategory: product_items?.subcategory_id || null,
        group: product_items?.group || null,
        status: Status.Active,
        total_amount: 0,
        prices: [],
        code: `${product_items.name
          .replace(' ', '_')
          .toUpperCase()}${generateRandomStr(4)}`,
      };
      if (product_items?.prices?.length) {
        product_items.prices.forEach((item: CreatePricingsDto) => {
          createProductsObj.totalAmount += parseFloat(
            this.calculateTaxValue(item.type, item.tax_value, item.base_value),
          );
          createProductsObj.prices.push({
            name: item.name,
            description: item.description,
            code: `${item.name
              .replace(' ', '_')
              .toUpperCase()}${generateRandomStr(4)}`,
            is_tax_applicable: [Percentage, Absolute].indexOf(item.type) > -1,
            type: item.type,
            base_value: item.base_value,
            status: Status.Active,
            final_value:
              [Percentage, Absolute].indexOf(item.type) > -1
                ? parseFloat(
                    this.calculateTaxValue(
                      item.type,
                      item.tax_value,
                      item.base_value,
                    ),
                  )
                : item.base_value,
          });
        });
      }
      const [createError, product]: any[] = await executePromise(
        this.create(createProductsObj),
      );

      if (createError) {
        this.log.error('createError');
        this.log.error(createError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!product) {
        this.log.info('!product');
        return { response_code: ResponseCodes.SERVER_ERROR };
      }
      this.log.info('product');
      this.log.info(product);

      return {
        response_code: ResponseCodes.SUCCESS,
        data: { product },
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
        status: Status.Active,

        category: products_filter?.category_id
          ? products_filter.category_id
          : undefined,
        subcategory: products_filter?.subcategory_id
          ? products_filter.subcategory_id
          : undefined,
        code: products_filter?.code ? products_filter.code : undefined,
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
        this.log.info(products);
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
