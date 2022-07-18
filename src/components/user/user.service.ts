import { UserEntity } from '@entities/user/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ApiError } from '@utils/api.error';
import { DetailRequest } from '@utils/detail.request';
import { PagingResponse } from '@utils/paging.response';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { UserRequest } from '@utils/user.request';
import { plainToClass } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { ResponseCodeEnum } from 'src/constants/response-code.enum';
import { Connection } from 'typeorm';
import { ListUserQueryRequestDto } from './dto/query/list-user.request.dto';
import { UpdateUserRequestDto } from './dto/request/update-role.request.dto';
import { UserResponseDto } from './dto/response/user.response.dto';
import { UserRepositoryInterface } from './interface/user.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,

    private readonly i18n: I18nService,

    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  public async getList(
    request: ListUserQueryRequestDto,
  ): Promise<ResponsePayload<UserResponseDto | any>> {
    const [data, count] = await this.userRepository.getList(request);

    const dataReturn = plainToClass(UserResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder({
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
  async update(
    request: UpdateUserRequestDto & DetailRequest,
    currentUser: UserRequest,
  ): Promise<any> {
    const user = await this.userRepository.findOneById(request.id);
    if (!user) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    if (user.id === currentUser.id) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CANNOT_UPDATE_CURRENT'))
        .build();
    }
    for (let key in request) {
      user[key] = request[key];
    }
    const result = await this.userRepository.create(user);
    const response = plainToClass(UserResponseDto, result, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }
  public async save(
    userEntity: UserEntity,
  ): Promise<ResponsePayload<UserResponseDto> | any> {
    try {
      const result = await this.userRepository.create(userEntity);

      const response = plainToClass(UserResponseDto, result, {
        excludeExtraneousValues: true,
      });

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData(response)
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }
}
