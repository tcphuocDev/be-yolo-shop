import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DetailRequest } from '@utils/detail.request';
import { PagingResponse } from '@utils/paging.response';
import { ResponseBuilder } from '@utils/response-builder';
import { UserRequest } from '@utils/user.request';
import { plainToClass } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { ResponseCodeEnum } from 'src/constants/response-code.enum';
import { Connection } from 'typeorm';
import { AddressIsMainEnum } from './address.constans';
import { ListAddressQuery } from './dto/query/list-address.query';
import { CreateAddressRequest } from './dto/request/create-address.request';
import { UpdateAddressRequest } from './dto/request/update-address.request';
import { AddressResponse } from './dto/response/address.response';
import { AddressRepositoryInterface } from './interface/address.repository.interface';

@Injectable()
export class AddressService {
  constructor(
    @Inject('AddressRepositoryInterface')
    private readonly addressRepository: AddressRepositoryInterface,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly i18n: I18nService,
  ) {}

  async create(request: CreateAddressRequest, user: UserRequest): Promise<any> {
    const addressEntiy = this.addressRepository.createAddressEntity(
      request,
      user.id,
    );
    const address = await this.addressRepository.create(addressEntiy);
    return new ResponseBuilder(address)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async list(request: ListAddressQuery, user: UserRequest): Promise<any> {
    const [data, count] = await this.addressRepository.list(request, user.id);

    const dataReturn = plainToClass(AddressResponse, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder<PagingResponse>({
      items: dataReturn,
      meta: {
        total: count,
        page: request.page,
      },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async detail(id: number, user: UserRequest): Promise<any> {
    const address = await this.addressRepository.findByCondition({
      id,
      userId: user.id,
    });
    if (!address) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const dataReturn = plainToClass(AddressResponse, address, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }
  async update(
    id: number,
    request: UpdateAddressRequest,
    user: UserRequest,
  ): Promise<any> {
    const address = await this.addressRepository.findOneByCondition({
      id,
      userId: user.id,
    });
    if (!address) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    for (let key in request) {
      address[key] = request[key];
    }

    const data = await this.addressRepository.create(address);
    const response = plainToClass(AddressResponse, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async delete(request: DetailRequest, user: UserRequest): Promise<any> {
    const address = await this.addressRepository.findOneByCondition({
      id: request.request.id,
      userId: user.id,
    });

    if (!address) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    await this.addressRepository.remove(address.id);
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }
}
