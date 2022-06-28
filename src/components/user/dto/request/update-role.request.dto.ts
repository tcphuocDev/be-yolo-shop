import { UserStatusEnum } from '@components/user/user.constants';
import { IsEnum, IsOptional } from 'class-validator';
import { RoleEnum } from 'src/constants/role.enum';

export class UpdateUserRequestDto {
  @IsEnum(RoleEnum)
  @IsOptional()
  role: RoleEnum;

  @IsEnum(UserStatusEnum)
  @IsOptional()
  isActive: UserStatusEnum;
}
