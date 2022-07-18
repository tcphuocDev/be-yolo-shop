import { CouponStatusEnum } from '@components/coupon/coupon.constans';
import { ListCouponQuery } from '@components/coupon/dto/query/list-coupon.query.dto';
import { CreateCouponRequest } from '@components/coupon/dto/request/create-coupon.request.dto';
import { CouponRepositoryInterface } from '@components/coupon/interface/coupon.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { CouponEntity } from '@entities/coupons/coupons.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { escapeCharForSearch } from '@utils/common';
import { Repository } from 'typeorm';

@Injectable()
export class CouponRepository
  extends BaseAbstractRepository<CouponEntity>
  implements CouponRepositoryInterface
{
  constructor(
    @InjectRepository(CouponEntity)
    private readonly couponRepository: Repository<CouponEntity>,
  ) {
    super(couponRepository);
  }

  public createEntity(request: CreateCouponRequest): CouponEntity {
    const newEntity = new CouponEntity();
    newEntity.code = request.code;
    newEntity.planQuantity = request.planQuantity;
    newEntity.actualQuantity = 0;
    newEntity.status = CouponStatusEnum.WaitingConfirm;
    newEntity.value = request.value;
    return newEntity;
  }

  public async list(request: ListCouponQuery): Promise<[any[], number]> {
    const query = this.couponRepository
      .createQueryBuilder('c')
      .select([
        'c.id AS id',
        'c.code AS code',
        'c.plan_quantity AS planQuantity',
        'c.actual_quantity AS actualQuantity',
        'c.value AS value',
        'c.created_at AS "createdAt"',
        'c.updated_at AS "updatedAt"',
      ]);

    if (request.keyword) {
      query.where(`UNACCENT(c.code) ILIKE UNACCENT(:keyword) escape '\\'`, {
        keyword: `%${escapeCharForSearch(request.keyword)}%`,
      });
    }
    const data = await query
      .orderBy('c.created_at', 'DESC')
      .limit(request.take)
      .offset(request.skip)
      .getRawMany();
    const count = await query.getCount();
    return [data, count];
  }
}
