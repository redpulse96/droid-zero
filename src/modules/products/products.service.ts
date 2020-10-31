import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import {
  InterfaceList,
  ResponseCodes,
  Status,
  TaxType
} from 'src/shared/constants';
import { Utils } from 'src/shared/util';
import { Repository } from 'typeorm';
import { CartsService } from '../carts/carts.service';
import { FetchCartDto } from '../carts/dto/carts-input.dto';
import { DotenvService } from '../dotenv/dotenv.service';
import { BackendLogger } from '../logger/BackendLogger';
import {
  CreatePricingsDto,
  CreateProductsDto,
  FetchProductDetailsDto
} from './dto/products-input.dto';
import { Products } from './products.entity';
const { executePromise, returnCatchFunction, generateRandomStr } = Utils;
const { Absolute, Discount, DiscountPercentage, Percentage } = TaxType;

@Injectable()
export class ProductService extends BaseService<Products> {
  private readonly log = new BackendLogger(ProductService.name);

  constructor (
    @InjectRepository(Products)
    private readonly productsRepo: Repository<Products>,
    private readonly cartsService: CartsService,
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
        brand: product_items?.brand_id || null,
        group: product_items?.group || null,
        status: Status.Active,
        total_amount: 0,
        prices: [],
        code: `${product_items.name
          .replace(/ /g, '_')
          .toUpperCase()}_${generateRandomStr(4)}`,
      };
      if (product_items?.prices?.length) {
        product_items.prices.forEach((item: CreatePricingsDto) => {
          const calculatedAmount: number = parseFloat(
            this.calculateTaxValue(
              item.type,
              item.tax_value,
              product_items.base_price,
            ),
          );
          if ([Percentage, Absolute].indexOf(item.type) > -1) {
            createProductsObj.total_amount += calculatedAmount;
          } else {
            createProductsObj.total_amount -= calculatedAmount;
          }
          createProductsObj.prices.push({
            name: item.name,
            description: item.description,
            type: item.type,
            is_tax_applicable: [Percentage, Absolute].indexOf(item.type) > -1,
            base_value: item.base_value,
            status: Status.Active,
            final_value: item?.type ? calculatedAmount : item.base_value,
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
      const filter: any = { status: Status.Active };
      products_filter?.id && (filter.id = products_filter.id);
      products_filter?.name && (filter.name = products_filter.name);
      products_filter?.category_id &&
        (filter.category = products_filter.category_id);
      products_filter?.brand_id && (filter.brand = products_filter.brand_id);
      products_filter?.code && (filter.code = products_filter.code);

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
        this.log.info(products);
        return { response_code: ResponseCodes.BAD_REQUEST };
      }
      this.log.info('products');
      this.log.info(products);
      products.map((val: any) => {
        val.prices.push({
          name: 'test',
          description: 'test',
          type: 'test',
          is_tax_applicable: true,
          base_value: 100,
          status: Status.Active,
          final_value: 110,
        });
      });

      return {
        response_code: ResponseCodes.SUCCESSFUL_FETCH,
        data: { products },
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

  public async fetchProductDetails(
    input: any,
  ): Promise<InterfaceList.MethodResponse> {
    try {
      const [productsError, products]: any[] = await executePromise(
        this.findByIds([input.product_id]),
      );
      if (productsError) {
        this.log.error('productsError', productsError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!products?.length) {
        this.log.info('!products?.length');
        this.log.info(products);
        return { response_code: ResponseCodes.BAD_REQUEST };
      }
      this.log.info('products');
      this.log.debug(products);
      const finalProducts: any = { ...products[0] };
      finalProducts.added_quantity = 0;

      const cartsFilter: FetchCartDto = {
        product_id: input.product_id,
        user_id: input.user.id,
      };
      const [cartError, cart]: any[] = await executePromise(
        this.cartsService.fetchCartListByFilter(cartsFilter),
      );
      if (cartError) {
        this.log.error('cartError', cartError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!cart?.data?.carts?.length) {
        this.log.info('!cart?.length');
        this.log.debug(cart);
      } else {
        this.log.info('cart');
        this.log.debug(cart);
        const addedProduct: any = cart.data.carts.find((val: any) => {
          return val.product.id == finalProducts.id;
        });
        finalProducts.added_quantity = addedProduct.quantity;
        finalProducts.prices = {
          name: 'test',
          description: 'test',
          type: 'test',
          is_tax_applicable: true,
          base_value: 100,
          status: Status.Active,
          final_value: 110,
        };
      }

      return {
        response_code: ResponseCodes.SUCCESSFUL_FETCH,
        data: { ...finalProducts },
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }
}
