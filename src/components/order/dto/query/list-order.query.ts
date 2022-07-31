import { IsMe } from '@components/order/order.constants';
import { PaginationQuery } from '@utils/pagination.query';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class ListOrderQuery extends PaginationQuery {
  @IsEnum(IsMe)
  @Transform((obj) => Number(obj.value))
  @IsOptional()
  isMe: IsMe;
}
