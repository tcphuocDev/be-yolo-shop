import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateColorRequest extends BaseDto {
  @ApiProperty({ example: 'vang' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'vang' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  code: string;
}
