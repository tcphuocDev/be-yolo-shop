import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSizeRequest extends BaseDto {
  @ApiProperty({ example: 'XXL' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
