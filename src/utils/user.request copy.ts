import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class UserRequest {
  @Transform((obj) => Number(obj.value))
  @IsInt()
  id: number;
}
