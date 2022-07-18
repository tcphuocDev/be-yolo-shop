import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { OrderDetailEntity } from '@entities/order/order-detail.entity';

export interface OrderDetailRepositoryInterface
  extends BaseAbstractRepository<OrderDetailEntity> {
  createOrderDetail(data: any): OrderDetailEntity;
}
