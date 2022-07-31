import { UserStatusEnum } from '@components/user/user.constants';
import { BaseDto } from '@core/dto/base.dto';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { RoleEnum } from 'src/constants/role.enum';
export class UpdateUserBodyDto extends BaseDto {
  @IsOptional()
  @IsEnum(RoleEnum)
  @Transform((value) => Number(value.value))
  role: RoleEnum;

  @IsOptional()
  @IsEnum(UserStatusEnum)
  @Transform((value) => Number(value.value))
  isActive: UserStatusEnum;
}
export class UpdateUserRequestDto extends UpdateUserBodyDto {
  @IsNotEmpty()
  @Transform((value) => Number(value.value))
  @IsNumber()
  id: number;
}
