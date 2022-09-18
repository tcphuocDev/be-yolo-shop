import { JwtAuthGuard } from '@components/auth/guards/jwt-auth.guard';
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
  UseGuards,
} from '@nestjs/common';
import { DetailRequest } from '@utils/detail.request';
import { isEmpty } from 'lodash';
import { RoleEnum } from 'src/constants/role.enum';
import { ListColorQuery } from './dto/query/list-color.query';
import { CreateColorRequest } from './dto/request/create-color.request';
import { UpdateColorRequest } from './dto/request/update-color.request';
import { ColorServiceInterface } from './interface/color.service.interface';

@Controller('colors')
export class ColorController {
  constructor(
    @Inject('ColorServiceInterface')
    private readonly colorService: ColorServiceInterface,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  createColor(@Body() payload: CreateColorRequest) {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.colorService.createColor(request);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateColor(
    @Body() payload: UpdateColorRequest,
    @Param('id', new ParseIntPipe()) id,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.colorService.updateColor({
      ...request,
      id,
    });
  }

  @Get('/list')
  list(@Query() request: ListColorQuery) {
    return this.colorService.list(request);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('/:id')
  detail(@Param() request: DetailRequest) {
    return this.colorService.detail(request);
  }

  
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  delete(@Param() payload: DetailRequest) {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.colorService.delete(request);
  }
}
