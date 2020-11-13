import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base.service';
import {
  COMPONENT_CODES,
  ImagesPath,
  InterfaceList,
  ResponseCodes,
  Status,
} from 'src/shared/constants';
import { Utils } from 'src/shared/util';
import { In, Repository } from 'typeorm';
import { DotenvService } from '../dotenv/dotenv.service';
import { BackendLogger } from '../logger/BackendLogger';
import { Brands } from './brands.entity';
import {
  CreateBrandsDto,
  FetchBrandsDto,
  UpdateBrandsDto,
} from './dto/brands-input.dto';
const { executePromise, returnCatchFunction, generateComponentCode } = Utils;

@Injectable()
export class BrandService extends BaseService<Brands> {
  private readonly log = new BackendLogger(BrandService.name);

  constructor(
    @InjectRepository(Brands)
    private readonly brandsRepo: Repository<Brands>,
    private readonly dotenvService: DotenvService,
  ) {
    super(brandsRepo);
  }

  public async createBrands(
    brands_input: CreateBrandsDto,
  ): Promise<InterfaceList.MethodResponse> {
    try {
      const createObj: any = {
        ...brands_input,
        code: generateComponentCode(COMPONENT_CODES['BRAND']),
        image_path: `${this.dotenvService.get('IMAGES_PATH')}${
          ImagesPath.Brands
        }${brands_input.name.replace(/ /g, '_').toUpperCase()}`,
        status: Status.Active,
      };

      const [brandsError, brands]: any[] = await executePromise(
        this.create(createObj),
      );
      if (brandsError) {
        this.log.error('brandsError', brandsError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!brands) {
        this.log.error('!brands?.length');
        return { response_code: ResponseCodes.EMPTY_RESPONSE };
      }
      this.log.info('brands');
      this.log.info(brands);
      return {
        response_code: ResponseCodes.SUCCESS,
        data: { ...brands },
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

  public async fetchBrandsListByFilter(
    brands_filter: FetchBrandsDto,
  ): Promise<InterfaceList.MethodResponse> {
    try {
      const filter: any = { status: Status.Active };
      brands_filter?.id?.length &&
        (filter.id = In([].concat(brands_filter.id)));
      brands_filter?.name && (filter.name = brands_filter.name);
      brands_filter?.code && (filter.code = brands_filter.code);
      this.log.info('fetchBrandsListByFilter.filter');
      this.log.info(filter);
      const [brandsError, brands]: any[] = await executePromise(
        this.findAll(filter),
      );
      if (brandsError) {
        this.log.error('brandsError', brandsError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!brands?.length) {
        this.log.info('!brands?.length');
        return { response_code: ResponseCodes.BAD_REQUEST };
      }
      this.log.info('brands');
      this.log.info(brands);
      return {
        response_code: ResponseCodes.SUCCESSFUL_FETCH,
        data: { brands },
      };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }

  public async updateBrands(
    data: UpdateBrandsDto,
  ): Promise<InterfaceList.MethodResponse> {
    try {
      const [brandsError, brands]: any[] = await executePromise(
        this.findOne({
          id: data.id,
          status: Status.Active,
        }),
      );
      if (brandsError) {
        this.log.error('brandsError', brandsError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      } else if (!brands?.id) {
        this.log.info('brands.not.exist');
        return { response_code: ResponseCodes.EMPTY_RESPONSE };
      }
      this.log.info('brands');
      this.log.info(brands);

      // TODO: ADD FILE UPLOADING OPTION
      const [updateBrandsError, updateBrands]: any[] = await executePromise(
        this.update({ id: data.id }, data.update_obj),
      );
      if (updateBrandsError) {
        this.log.error('updateBrandsError', updateBrandsError);
        return { response_code: ResponseCodes.SERVICE_UNAVAILABLE };
      }
      this.log.info('updateBrands');
      this.log.info(updateBrands);
      return { response_code: ResponseCodes.UPDATE_SUCCESSFUL };
    } catch (error) {
      return returnCatchFunction(error);
    }
  }
}
