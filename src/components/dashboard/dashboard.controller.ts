import { Controller, Get, Inject, Query } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { DateRangeQuery } from './dto/query/date-range.query';
import { DashboardServiceInterface } from './interface/dashboard.service.interface';

@Controller('dashboard')
export class DashboardController {
  constructor(
    @Inject('DashboardServiceInterface')
    private readonly dashboardService: DashboardServiceInterface,
  ) {}

  @Get('/summary')
  summary() {
    return this.dashboardService.list();
  }

  @Get('/order-status')
  orderStatus(@Query() payload: DateRangeQuery) {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.dashboardService.orderStatus(request);
  }

  @Get('/dashboard-money')
  dashboardMoney(@Query() payload: DateRangeQuery) {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.dashboardService.dashboardMoney(request);
  }

  @Get('/customer')
  customer() {
    return this.dashboardService.customer();
  }
}
