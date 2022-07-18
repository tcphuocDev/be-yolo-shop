import { JwtAuthGuard } from '@components/auth/guards/jwt-auth.guard';
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
  Request,
  UseGuards,
} from '@nestjs/common';
import { DetailRequest } from '@utils/detail.request';
import { isEmpty } from 'lodash';
import { ListAddressQuery } from './dto/query/list-address.query';
import { CreateAddressRequest } from './dto/request/create-address.request';
import { UpdateAddressRequest } from './dto/request/update-address.request';
import { AddressServiceInterface } from './interface/address.service.interface';

@Controller('address')
export class AddressController {
  constructor(
    @Inject('AddressServiceInterface')
    private readonly addressService: AddressServiceInterface,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() payload: CreateAddressRequest, @Request() req: any) {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.addressService.create(request, req.user);
  }

  @Get('/list')
  list(@Query() payload: ListAddressQuery, @Request() req: any) {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.addressService.list(request, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  detail(@Param('id', new ParseIntPipe()) id: number, @Request() req: any) {
    return this.addressService.detail(id, req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Body() payload: UpdateAddressRequest,
    @Param('id', new ParseIntPipe()) id: number,
    @Request() req: any,
  ) {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.addressService.update(id, request, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param() request: DetailRequest, @Request() req: any) {
    return this.addressService.delete(request, req.user);
  }
}
