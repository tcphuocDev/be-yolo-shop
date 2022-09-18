import { Inject, Injectable } from '@nestjs/common';
import { ApiError } from '@utils/api.error';
import { DetailRequest } from '@utils/detail.request';
import { PagingResponse } from '@utils/paging.response';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToClass } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { ResponseCodeEnum } from 'src/constants/response-code.enum';
import { ListColorQuery } from './dto/query/list-color.query';
import { CreateColorRequest } from './dto/request/create-color.request';
import { UpdateColorRequest } from './dto/request/update-color.request';
import { ColorResponse } from './dto/response/color.response';
import { ColorRepositoryInterface } from './interface/color.repository.interface';

@Injectable()
export class ColorService {
  constructor(
    @Inject('ColorRepositoryInterface')
    private readonly colorRepository: ColorRepositoryInterface,

    private readonly i18n: I18nService,
  ) {}

  async createColor(request: CreateColorRequest): Promise<any> {
    const colorEntity = this.colorRepository.createEntity(request);
    const color = await this.colorRepository.create(colorEntity);
    return new ResponseBuilder(color)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  public async updateColor(request: any): Promise<any> {
    const color = await this.colorRepository.findOneById(request.id);
    if (!color) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }
    color.name = request.name;

    const data = await this.colorRepository.create(color);

    const response = plainToClass(ColorResponse, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(response)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async list(request: ListColorQuery): Promise<ResponsePayload<any>> {
    const [data, count] = await this.colorRepository.list(request);

    const dataReturn = plainToClass(ColorResponse, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder({
      items: dataReturn,
      meta: {
        total: count,
        page: request.request.page,
      },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('message.SUCCESS'))
      .build();
  }

  async detail(request: DetailRequest): Promise<any> {
    const color = await this.colorRepository.findOneById(request.id);
    if (!color) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const dataReturn = plainToClass(ColorResponse, color, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .build();
  }

  async delete(id: number): Promise<any> {
    const color = await this.colorRepository.findOneById(id);
    if (!color) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    try {
      await this.colorRepository.remove(id);
      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CAN_NOT_DELETE'),
      ).toResponse();
    }
  }
}
