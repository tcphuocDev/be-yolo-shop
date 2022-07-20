import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryRequest extends BaseDto {
  @ApiProperty({ example: 'Ao thun' })
  @MinLength(1)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Ao thun bo' })
  @IsString()
  @IsOptional()
  description: string;
}
