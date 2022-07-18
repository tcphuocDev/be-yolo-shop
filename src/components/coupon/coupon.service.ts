import { CouponEntity } from '@entities/coupons/coupons.entity';
import { Inject, Injectable } from '@nestjs/common';
import { DetailRequest } from '@utils/detail.request';
import { PagingResponse } from '@utils/paging.response';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToClass } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { ResponseCodeEnum } from 'src/constants/response-code.enum';
import { CouponStatusEnum } from './coupon.constans';
import { ListCouponQuery } from './dto/query/list-coupon.query.dto';
import { CheckCouponRequest } from './dto/request/check-coupon.request';
import { CreateCouponRequest } from './dto/request/create-coupon.request.dto';
import { UpdateCouponRequest } from './dto/request/update-coupon.request';
import { CouponResponse } from './dto/response/coupon.response';
import { CouponRepositoryInterface } from './interface/coupon.repository.interface';

@Injectable()
export class CouponService {
  constructor(
    @Inject('CouponRepositoryInterface')
    private readonly couponRepository: CouponRepositoryInterface,

    private readonly i18n: I18nService,
  ) {}

  async createCoupon(request: CreateCouponRequest): Promise<any> {
    try {
      const { code } = request;
      const couponExist = await this.couponRepository.findOneByCondition({
        code: code,
      });
      if (couponExist) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.CODE_EXISTS'))
          .build();
      }
      const couponEntity = this.couponRepository.createEntity(request);
      const coupon = await this.couponRepository.create(couponEntity);
      return new ResponseBuilder(coupon)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('message.SUCCESS'))
        .build();
    } catch (error) {
      console.log('error', error);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  async list(request: ListCouponQuery): Promise<ResponsePayload<any>> {
    const [data, count] = await this.couponRepository.list(request);
    const dataReturn = plainToClass(CouponResponse, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder({
      items: dataReturn,
      meta: {
        total: count,
        page: request.page,
      },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async detail(request: DetailRequest): Promise<any> {
    const coupon = await this.couponRepository.findOneByCondition({
      id: request.id,
    });
    if (!coupon) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const dataReturn = plainToClass(CouponResponse, coupon, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async update(request: UpdateCouponRequest): Promise<any> {
    const coupon = await this.couponRepository.findOneByCondition({
      id: request.id,
    });
    if (!coupon) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    if (coupon.status === CouponStatusEnum.Confirmed) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.CAN_NOT_UPDATE_CONFIRMED_RECORD'),
        )
        .build();
    }
    coupon.code = request.code;
    coupon.planQuantity = request.planQuantity;
    coupon.value = request.value;

    const response = await this.couponRepository.create(coupon);

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async check(request: CheckCouponRequest): Promise<any> {
    let status = true;
    const coupon = await this.couponRepository.findOneByCondition({
      code: request.code,
      status: CouponStatusEnum.Confirmed,
    });
    if (!coupon) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    if (coupon.actualQuantity >= coupon.planQuantity) {
      status = false;
    }

    return new ResponseBuilder({
      status,
      id: coupon.id,
      value: coupon.value,
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async confirm(request: DetailRequest): Promise<ResponsePayload<any>> {
    const coupon = await this.couponRepository.findOneByCondition({
      id: request.id,
    });
    if (!coupon) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    if (coupon.status === CouponStatusEnum.Confirmed) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.CAN_NOT_UPDATE_STATUS'))
        .build();
    }

    coupon.status = CouponStatusEnum.Confirmed;
    const response = await this.couponRepository.create(coupon);

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async delete(request: DetailRequest): Promise<any> {
    const coupon = await this.couponRepository.findOneByCondition({
      id: request.id,
    });

    if (!coupon) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    if (coupon.status === CouponStatusEnum.Confirmed) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(
          await this.i18n.translate('error.CAN_NOT_DELETE_CONFIRMED_RECORD'),
        )
        .build();
    }

    await this.couponRepository.remove(coupon.id);
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }
}
