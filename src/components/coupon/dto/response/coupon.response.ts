import { Expose } from 'class-transformer';

export class CouponResponse {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  planQuantity: number;

  @Expose()
  actualQuantity: number;

  @Expose()
  value: number;

  @Expose()
  status: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
