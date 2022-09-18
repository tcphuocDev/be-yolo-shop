import { JwtAuthGuard } from '@components/auth/guards/jwt-auth.guard';
import { ColorServiceInterface } from '@components/color/interface/color.service.interface';
import { Roles } from '@core/decorators/roles.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DetailRequestBody } from '@utils/detail.request';
import { request } from 'http';
import { isEmpty } from 'lodash';
import { RoleEnum } from 'src/constants/role.enum';
import { ListSizeQuery } from './dto/query/list-size.request';
import { CreateSizeRequest } from './dto/request/create-size.request';
import { UpdateSizeBodyRequest } from './dto/request/update-size.request';
import { SizeServiceInterface } from './interface/size.service.interface';

@Controller('sizes')
export class SizeController {
  constructor(
    @Inject('SizeServiceInterface')
    private readonly sizeService: SizeServiceInterface,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  createColor(@Body() payload: CreateSizeRequest) {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.sizeService.create(request);
  }

  @Get('/list')
  list(@Query() payload: ListSizeQuery) {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.sizeService.list(request);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.ADMIN)
  @Get(':id')
  detail(
    @Param('id', new ParseIntPipe()) id,
    @Req() payload: DetailRequestBody,
  ) {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.sizeService.detail({
      ...request,
      id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async update(
    @Body() payload: UpdateSizeBodyRequest,
    @Param('id', new ParseIntPipe()) id,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.sizeService.update({
      id,
      ...request,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async delete(@Param() payload: DetailRequestBody): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.sizeService.delete(request);
  }
}
