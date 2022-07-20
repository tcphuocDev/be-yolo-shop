import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateColorRequest extends BaseDto {
  @ApiProperty({ example: 'vang' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
