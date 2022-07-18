import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { CouponEntity } from '@entities/coupons/coupons.entity';
import { ListCouponQuery } from '../dto/query/list-coupon.query.dto';
import { CreateCouponRequest } from '../dto/request/create-coupon.request.dto';

export interface CouponRepositoryInterface
  extends BaseAbstractRepository<CouponEntity> {
  createEntity(request: CreateCouponRequest): CouponEntity;
  list(request: ListCouponQuery): Promise<any>;
}
