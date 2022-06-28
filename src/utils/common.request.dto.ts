import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteRequestDto extends BaseDto {
  @ApiProperty({ example: 1, description: 'Mã id' })
  @IsNotEmpty()
  @IsInt()
  id: number;
}

export class DetailRequestDto extends BaseDto {
  @ApiProperty({ example: 1, description: 'Mã id' })
  @IsNotEmpty()
  @IsInt()
  id: number;
}
