import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { AddressEntity } from '@entities/address/address.entity';
import { ListAddressQuery } from '../dto/query/list-address.query';
import { CreateAddressRequest } from '../dto/request/create-address.request';

export interface AddressRepositoryInterface
  extends BaseAbstractRepository<AddressEntity> {
  createAddressEntity(
    request: CreateAddressRequest,
    userId: number,
  ): AddressEntity;
  list(request: ListAddressQuery, userId: number): Promise<any>;
}
