import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import {
  COMPONENT_CODES,
  InterfaceList,
  ResponseCodes,
  Status,
  TaxType,
} from 'src/shared/constants';
import { Utils } from 'src/shared/util';
import { Repository } from 'typeorm';
import { CartService } from '../carts/carts.service';
import { FetchCartDto } from '../carts/dto/carts-input.dto';
import { DotenvService } from '../dotenv/dotenv.service';
import { BackendLogger } from '../logger/BackendLogger';
import {
  CreateProductsDto,
  FetchProductDetailsDto,
} from './dto/products-input.dto';
import { Products } from './products.entity';
const { executePromise, returnCatchFunction, generateComponentCode } = Utils;
const { Absolute, Discount, DiscountPercentage, Percentage } = TaxType;

@Injectable()
export class ProductService extends BaseService<Products> {
  private readonly log = new BackendLogger(ProductService.name);

  constructor(
    @InjectRepository(Products)
    private readonly productsRepo: Repository<Products>,
    private readonly cartService: CartService,
    private readonly dotenvService: DotenvService,
  ) {
    super(productsRepo);
  }

  public calculateTaxValue(
    taxType: string | undefined,
    taxValue: number,
    baseValue: number,
  ): string {
    switch (taxType) {
      case Percentage:
        return (baseValue + baseValue * (taxValue / 100)).toString();
      case Absolute:
        return (baseValue + taxValue).toString();
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
        category: product_items?.category_id,
        brand: product_items?.brand_id,
        group: product_items?.group,
        available_quantity: product_items?.available_quantity,
        maximum_allowed_quantity: product_items?.maximum_allowed_quantity,
        status: Status.Active,
        base_price: product_items.base_price,
        tax_type: product_items.tax_type,
        tax_value: product_items.tax_value,
        is_tax_applicable: product_items.tax_value ? true : false,
        code: generateComponentCode(COMPONENT_CODES['PRODUCT']),
        total_amount: parseFloat(
          this.calculateTaxValue(
            product_items.tax_type,
            product_items.tax_value || 0,
            product_items.base_price,
          ),
        ),
      };
      const [createError, product]: any[] = await executePromise(
        this.create(createProductsObj),
      );
      if (createError) {
        this.log.error('createError', createError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!product) {
        this.log.info('!product');
        return { response_code: ResponseCodes.SERVER_ERROR };
      }
      this.log.info('product');
      this.log.debug(product);

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
      products_filter?.brand_id && (filter.brand = products_filter.brand_id);
      products_filter?.code && (filter.code = products_filter.code);
      products_filter?.category_id &&
        (filter.category = products_filter.category_id);

      this.log.info('fetchProductListByFilter.filter');
      this.log.debug(filter);
      const [productsError, products]: any[] = await executePromise(
        this.findAll(filter),
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
      products.map((val: any) => {
        val.prices = [
          {
            name: val.tax_type,
            description: val.tax_type,
            type: val.tax_type,
            is_tax_applicable: val.is_tax_applicable,
            base_value: val.base_price,
            final_value: val.total_amount,
            status: Status.Active,
          },
        ];
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
      finalProducts.prices = {
        name: finalProducts.tax_type,
        description: finalProducts.tax_type,
        type: finalProducts.tax_type,
        is_tax_applicable: finalProducts.is_tax_applicable,
        base_value: finalProducts.base_price,
        final_value: finalProducts.total_amount,
        status: Status.Active,
      };

      const cartsFilter: FetchCartDto = {
        product_id: input.product_id,
        user_id: input.user.id,
      };
      const [cartError, cart]: any[] = await executePromise(
        this.cartService.fetchCartListByFilter(cartsFilter),
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
      }

      return {
        response_code: ResponseCodes.SUCCESSFUL_FETCH,
        data: { ...finalProducts },
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

  public async updateQuantity(input: any): Promise<any> {
    try {
      if (!input?.length) {
        return false;
      }
      const promises: any = [];
      input.map((val: any) => {
        promises.push(
          this.update(
            {
              id: val.product_id,
            },
            {
              available_quantity: val.available_quantity,
            },
          ),
        );
      });

      const updated_products: any = await Promise.all(promises);
      this.log.info('updated_products');
      this.log.debug(updated_products);
    } catch (error) {
      return false;
    }
  }
}
