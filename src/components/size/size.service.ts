import { ColorRepositoryInterface } from '@components/color/interface/color.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { DetailRequest } from '@utils/detail.request';
import { PagingResponse } from '@utils/paging.response';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToClass } from 'class-transformer';
import { isEmpty } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import { ResponseCodeEnum } from 'src/constants/response-code.enum';
import { ListSizeQuery } from './dto/query/list-size.request';
import { CreateSizeRequest } from './dto/request/create-size.request';
import { UpdateSizeRequest } from './dto/request/update-size.request';
import { SizeResponse } from './dto/response/size.response';
import { SizeRepositoryInterface } from './interface/size.repository.interface';

@Injectable()
export class SizeService {
  constructor(
    @Inject('SizeRepositoryInterface')
    private readonly sizeRepository: SizeRepositoryInterface,

    private readonly i18n: I18nService,
  ) {}

  async create(request: CreateSizeRequest): Promise<any> {
    const sizeEntity = await this.sizeRepository.createEntity(request);
    const size = await this.sizeRepository.create(sizeEntity);
    return new ResponseBuilder(size)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async list(request: ListSizeQuery): Promise<ResponsePayload<any>> {
    const [data, count] = await this.sizeRepository.list(request);

    const dataReturn = plainToClass(SizeResponse, data, {
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

  async detail(request: DetailRequest): Promise<any> {
    try {
      const size = await this.sizeRepository.findOneById(request.id);
      if (isEmpty(size)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      const response = plainToClass(SizeResponse, size, {
        excludeExtraneousValues: true,
      });
      return new ResponseBuilder(response)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('message.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  async update(request: UpdateSizeRequest): Promise<any> {
    const size = await this.sizeRepository.findOneById(request.id);
    if (!size) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    size.name = request.name;
    const data = await this.sizeRepository.create(request);
    const response = plainToClass(SizeResponse, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async delete(id: number): Promise<any> {
    try {
      const size = await this.sizeRepository.findOneById(id);
      if (isEmpty(size)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      await this.sizeRepository.remove(id);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('message.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('message.BAD_REQUEST'))
        .build();
    }
  }
}
