import { DetailRequest } from '@utils/detail.request';
import { ResponsePayload } from '@utils/response-payload';
import { ListCouponQuery } from '../dto/query/list-coupon.query.dto';
import { CheckCouponRequest } from '../dto/request/check-coupon.request';
import { CreateCouponRequest } from '../dto/request/create-coupon.request.dto';
import { UpdateCouponRequest } from '../dto/request/update-coupon.request';

export interface CouponServiceInterface {
  createCoupon(request: CreateCouponRequest): Promise<any>;
  list(request: ListCouponQuery): Promise<ResponsePayload<any>>;
  detail(request: DetailRequest): Promise<any>;
  update(request: UpdateCouponRequest): Promise<any>;
  check(request: CheckCouponRequest): Promise<any>;
  confirm(request: DetailRequest): Promise<any>;
  delete(request: DetailRequest): Promise<any>;
}
