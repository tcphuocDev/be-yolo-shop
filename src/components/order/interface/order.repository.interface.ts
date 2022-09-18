import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { OrderEntity } from '@entities/order/order.entity';
import { DetailRequest } from '@utils/detail.request';
import { IsMeQuery } from '@utils/is-me.query';
import { UserRequest } from '@utils/user.request';
import { ListOrderQuery } from '../dto/query/list-order.query';
import { DetailOrderResoponse } from '../dto/response/detail-order.response';

export interface OrderRepositoryInterface
  extends BaseAbstractRepository<OrderEntity> {
  createOrder(userId: number, data: any): OrderEntity;

  detail(id: number, request: IsMeQuery, user: number): Promise<any>;

  list(request: ListOrderQuery, userId: number): Promise<[any[], number]>;
  sumMoney();
  dashboardMoney(startDate: Date, endDate: Date): Promise<any>;
}
