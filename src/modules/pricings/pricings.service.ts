import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import { InterfaceList, ResponseCodes, Status, TaxType } from 'src/shared/constants';
import { Utils } from 'src/shared/util';
import { Like, Repository } from 'typeorm';
import { DotenvService } from '../dotenv/dotenv.service';
import { BackendLogger } from '../logger/BackendLogger';
import { CreatePricingsDto, FetchPricingDetailsDto } from './dto/pricings-input.dto';
import { Pricings } from './pricings.entity';
const { executePromise, returnCatchFunction, generateRandomStr } = Utils;
const { Absolute, Discount, DiscountPercentage, Percentage } = TaxType;

@Injectable()
export class PricingsService extends BaseService<Pricings>{
  private readonly log = new BackendLogger(PricingsService.name);

  constructor (
    @InjectRepository(Pricings)
    private readonly pricingsRepo: Repository<Pricings>,
    private readonly dotenvService: DotenvService,
  ) {
    super(pricingsRepo);
  }

  private calculateTaxValue(taxType: string, taxValue: number, baseValue: number): string {
    switch (taxType) {
      case Percentage:
        return (baseValue + (baseValue * (taxValue / 100))).toString();
      case Absolute:
        return taxValue.toString();
      case DiscountPercentage:
        return (baseValue - (baseValue * (taxValue / 100))).toString();
      case Discount:
        return (baseValue - taxValue).toString();
      default:
        return (baseValue).toString();
    }
  }

  public async createPricings(
    price_items: CreatePricingsDto[],
  ): Promise<InterfaceList.MethodResponse> {
    try {
      const createPricingsArr: any = [];
      let totalAmount: number = 0;
      price_items.forEach((item: CreatePricingsDto) => {
        createPricingsArr.push({
          name: item.name,
          description: item.description,
          productId: item.productId,
          code: `${item.name
            .replace(' ', '_')
            .toUpperCase()}${generateRandomStr(4)}`,
          is_tax_applicable: [Percentage, Absolute].indexOf(item.type) > -1,
          type: item.type,
          base_value: item.base_value,
          final_value: ([Percentage, Absolute].indexOf(item.type) > -1)
            ? parseFloat(this.calculateTaxValue(item.type, item.tax_value, item.base_value))
            : item.base_value,
          status: Status.Active,
        });
        totalAmount += parseFloat(this.calculateTaxValue(item.type, item.tax_value, item.base_value));
      });

      const [createError, pricings]: any[] = await executePromise(
        this.create(createPricingsArr),
      );
      if (createError) {
        this.log.error('createError');
        this.log.error(createError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!pricings?.length) {
        this.log.info('!pricings?.length');
        return { response_code: ResponseCodes.SERVER_ERROR };
      }
      this.log.info('---pricings---');
      this.log.info(pricings);
      return {
        response_code: ResponseCodes.SUCCESS,
        data: { totalAmount },
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

  public async fetchProductListByFilter(
    pricings_filter: FetchPricingDetailsDto,
  ): Promise<InterfaceList.MethodResponse> {
    try {
      const filter: any = {
        id: pricings_filter?.id ? pricings_filter.id : undefined,
        name: pricings_filter?.name ? Like(`%${pricings_filter.name}%`) : undefined,
        description: pricings_filter?.description ? Like(`%${pricings_filter.description}%`) : undefined,
        code: pricings_filter?.code ? Like(`%${pricings_filter.code}%`) : undefined,
        status: Status.Active,
      };
      this.log.info('fetchProductListByFilter.filter');
      this.log.info(filter);
      const [pricingsError, pricings]: any[] = await executePromise(
        this.findAll(filter),
      );
      if (pricingsError) {
        this.log.error('pricingsError');
        this.log.error(pricingsError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!pricings?.length) {
        this.log.info('!pricings?.length');
        return { response_code: ResponseCodes.BAD_REQUEST };
      }
      this.log.info('pricings');
      this.log.info(pricings);
      return {
        response_code: ResponseCodes.SUCCESSFUL_FETCH,
        data: { pricings },
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

}
