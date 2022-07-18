import { OrderDetailRepositoryInterface } from '@components/order/interface/order-detail.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { OrderDetailEntity } from '@entities/order/order-detail.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderDetailRepository
  extends BaseAbstractRepository<OrderDetailEntity>
  implements OrderDetailRepositoryInterface
{
  constructor(
    @InjectRepository(OrderDetailEntity)
    private readonly orderDetailRepository: Repository<OrderDetailEntity>,
  ) {
    super(orderDetailRepository);
  }
  createOrderDetail(data: any): OrderDetailEntity {
    const { productVersionId, orderId, quantity } = data;
    const newEntity = new OrderDetailEntity();
    newEntity.productVersionId = productVersionId;
    newEntity.orderId = orderId;
    newEntity.quantity = quantity;
    return newEntity;
  }
}
