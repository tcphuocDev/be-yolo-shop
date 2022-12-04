import { UserStatusEnum } from '@components/user/user.constants';
import { BaseDto } from '@core/dto/base.dto';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { RoleEnum } from 'src/constants/role.enum';
export class UpdateUserRequestBody extends BaseDto {
  @IsEnum(RoleEnum)
  @IsOptional()
  role: RoleEnum;

  @IsEnum(UserStatusEnum)
  @IsOptional()
  isActive: UserStatusEnum;
}
export class UpdateUserRequestDto extends UpdateUserRequestBody {
  @IsNumber()
  @Transform((value) => Number(value.value))
  @IsNotEmpty()
  id: number;
}
