import { IsMe } from '@components/order/order.constants';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class IsMeQuery {
  @IsEnum(IsMe)
  @Transform(({ value }) => +value)
  @IsOptional()
  isMe: IsMe;
}
