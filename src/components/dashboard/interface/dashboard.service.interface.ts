import { ResponsePayload } from '@utils/response-payload';
import { DateRangeQuery } from '../dto/query/date-range.query';

export interface DashboardServiceInterface {
  customer(): Promise<ResponsePayload<any>>;
  list(): Promise<ResponsePayload<any>>;
  dashboardMoney(request: DateRangeQuery): Promise<ResponsePayload<any>>;
  orderStatus(request: DateRangeQuery): Promise<ResponsePayload<any>> 
}
