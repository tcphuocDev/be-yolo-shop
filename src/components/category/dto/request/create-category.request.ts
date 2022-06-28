import { BaseDto } from '@core/dto/base.dto';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryRequest extends BaseDto {
  @MinLength(1)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
