import { JwtAuthGuard } from '@components/auth/guards/jwt-auth.guard';
import { Roles } from '@core/decorators/roles.decorator';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Inject,
  Query,
  Param,
  Get,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { DetailRequest } from '@utils/detail.request';
import { IsMeQuery } from '@utils/is-me.query';
import { isEmpty } from 'lodash';
import { RoleEnum } from 'src/constants/role.enum';
import { ListOrderQuery } from './dto/query/list-order.query';
import { ChangeStatusRequest } from './dto/request/change-status.request';
import { CheckoutOrderRequest } from './dto/request/checkout-order.request';
import { CreateOrderRequest } from './dto/request/create-order.request';
import { UpdateOrderBodyDto } from './dto/request/update-order.request';
import { OrderServiceInterface } from './interface/order.service.interface';

@Controller('orders')
export class OrderController {
  constructor(
    @Inject('OrderServiceInterface')
    private readonly orderService: OrderServiceInterface,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(@Body() payload: CreateOrderRequest, @Request() req: any) {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.orderService.create(request, req.user);
  }

  @Get('/list')
  list(@Query() query: ListOrderQuery, @Request() req: any) {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.orderService.list(request, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  detail(
    @Param('id', new ParseIntPipe()) id: number,
    @Query() query: IsMeQuery,
    @Request() req: any,
  ) {
    return this.orderService.detail(id, { ...query }, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Body() body: UpdateOrderBodyDto,
    @Param('id', new ParseIntPipe()) id: number,
    @Request() req: any,
  ) {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.orderService.update({ ...request, id }, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  checkout(@Body() body: CheckoutOrderRequest, @Request() req: any) {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.orderService.checkout({ ...request }, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.ADMIN)
  @Put(':id/change-status')
  changeStatus(@Body() body: ChangeStatusRequest, @Param('id') id: number) {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.orderService.changeStatus(request, id);
  }
}