import { BaseResponse } from '@components/product/dto/response/list-product.response';
import { Expose, Type } from 'class-transformer';

class UserOrder {
  @Expose()
  id: number;

  @Expose()
  fullname: string;

  @Expose()
  phone: string;
}

// class CouponOrder {
//   @Expose()
//   id: number;

//   @Expose()
//   code: string;

//   @Expose()
//   value: number;
// }

class OrderDetail {
  @Expose()
  productId: number;

  @Expose()
  productName: string;

  @Expose()
  productVersionId: number;

  @Expose()
  price: number;

  @Expose()
  orderPrice: number;

  @Expose()
  salePrice: number;

  @Expose()
  quantity: number;

  @Type(() => BaseResponse)
  @Expose()
  color: BaseResponse;

  @Type(() => BaseResponse)
  @Expose()
  size: BaseResponse;
}

export class DetailOrderResoponse {
  @Expose()
  id: number;

  @Expose()
  @Type(() => UserOrder)
  user: UserOrder;

  // @Expose()
  // @Type(() => CouponOrder)
  // coupon: CouponOrder;
  @Expose()
  phone: string;

  @Expose()
  status: number;

  @Expose()
  address: string;

  @Expose()
  @Type(() => OrderDetail)
  orderDetails: OrderDetail[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
