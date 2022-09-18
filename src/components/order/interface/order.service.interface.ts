import { DetailRequest } from '@utils/detail.request';
import { IsMeQuery } from '@utils/is-me.query';
import { ResponsePayload } from '@utils/response-payload';
import { UserRequest } from '@utils/user.request';
import { ListOrderQuery } from '../dto/query/list-order.query';
import { ChangeStatusRequest } from '../dto/request/change-status.request';
import { CheckoutOrderPublicRequest } from '../dto/request/checkout-order.public.request';
import { CheckoutOrderRequest } from '../dto/request/checkout-order.request';
import { CreateOrderRequest } from '../dto/request/create-order.request';
import { UpdateOrderRequest } from '../dto/request/update-order.request';
import { DetailOrderResoponse } from '../dto/response/detail-order.response';

export interface OrderServiceInterface {
  create(
    request: CreateOrderRequest,
    user: UserRequest,
  ): Promise<ResponsePayload<any>>;

  detail(id: number, request: IsMeQuery, user: number): Promise<any>;

  list(
    request: ListOrderQuery,
    user: UserRequest,
  ): Promise<ResponsePayload<any>>;

  update(
    request: UpdateOrderRequest,
    user: UserRequest,
  ): Promise<ResponsePayload<any>>;

  checkout(request: CheckoutOrderRequest, user: UserRequest): Promise<any>;

  // changeStatus(
  //   request: ChangeStatusRequest,
  //   id: number,
  // ): Promise<ResponsePayload<any>>;
  changeStatus(
    request: ChangeStatusRequest & DetailRequest,
  ): Promise<ResponsePayload<any>>;

  checkoutPublic(request: CheckoutOrderPublicRequest): Promise<any>;
}
