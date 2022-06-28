import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class BaseDto {
  request: any;
  responseError: any;
}
