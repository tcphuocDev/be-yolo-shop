import { BaseDto } from '@core/dto/base.dto';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { GenderEnum } from 'src/constants/gender.enum';

export class UpdateUserRequestDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: GenderEnum;
}
