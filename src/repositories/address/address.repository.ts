import { ListAddressQuery } from '@components/address/dto/query/list-address.query';
import { CreateAddressRequest } from '@components/address/dto/request/create-address.request';
import { AddressRepositoryInterface } from '@components/address/interface/address.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { AddressEntity } from '@entities/address/address.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AddressRepository
  extends BaseAbstractRepository<AddressEntity>
  implements AddressRepositoryInterface
{
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {
    super(addressRepository);
  }

  public createAddressEntity(
    request: CreateAddressRequest,
    userId: number,
  ): AddressEntity {
    const newEntity = new AddressEntity();
    newEntity.address = request.address;
    newEntity.userId = userId;
    return newEntity;
  }

  public async list(request: ListAddressQuery, userId: number): Promise<any> {
    const query = this.addressRepository
      .createQueryBuilder('ar')
      .select(['ar.id AS id', 'ar.address AS address'])
      .where('user_id = :userId', {
        userId,
      });
    const data = await query
      // .limit(request.take)
      // .offset(request.skip)
      .getRawMany();
    const count = await query.getCount();
    return [data, count];
  }
}
