import { JwtAuthGuard } from '@components/auth/guards/jwt-auth.guard';
import { Public } from '@core/decorators/public.decorator';
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
import { ListCouponQuery } from './dto/query/list-coupon.query.dto';
import { CheckCouponRequest } from './dto/request/check-coupon.request';
import { CreateCouponRequest } from './dto/request/create-coupon.request.dto';
import { UpdateCouponBodyDto } from './dto/request/update-coupon.request';
import { CouponServiceInterface } from './interface/coupon.service.interface';

@Controller('coupons')
export class CouponController {
  constructor(
    @Inject('CouponServiceInterface')
    private readonly couponService: CouponServiceInterface,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.ADMIN)
  @Post('/create')
  create(@Body() payload: CreateCouponRequest) {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.couponService.createCoupon(request);
  }

  @Get('/list')
  list(@Query() request: ListCouponQuery) {
    return this.couponService.list(request);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('/:id')
  async detail(@Param() param: DetailRequest) {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.couponService.detail(request);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.ADMIN)
  @Put('/:id')
  async update(
    @Param('id', new ParseIntPipe()) id,
    @Body() payload: UpdateCouponBodyDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.id = Number(id);
    return await this.couponService.update(request);
  }

  @Public()
  @Post('check')
  check(@Body() payload: CheckCouponRequest) {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.couponService.check(request);
  }

  @Put(':id/confirm')
  confirm(@Param() param: DetailRequest) {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.couponService.confirm(request);
  }
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.ADMIN)
  @Delete('/:id')
  delete(@Param() param: DetailRequest) {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.couponService.delete(request);
  }
}
