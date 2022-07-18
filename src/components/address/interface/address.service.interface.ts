import { DetailRequest } from '@utils/detail.request';
import { UserRequest } from '@utils/user.request';
import { ListAddressQuery } from '../dto/query/list-address.query';
import { CreateAddressRequest } from '../dto/request/create-address.request';
import { UpdateAddressRequest } from '../dto/request/update-address.request';

export interface AddressServiceInterface {
  create(request: CreateAddressRequest, user: UserRequest): Promise<any>;
  list(request: ListAddressQuery, user: UserRequest): Promise<any>;
  detail(id: number, user: UserRequest): Promise<any>;
  update(
    id: number,
    request: UpdateAddressRequest,
    user: UserRequest,
  ): Promise<any>;
  delete(request: DetailRequest, user: UserRequest): Promise<any>;
}
