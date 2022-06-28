import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EnumSort } from './common';

export class Sort {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  column: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EnumSort)
  order: any;
}

export class Filter {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  column: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  text: string;
}
export class PaginationQuery extends BaseDto {
  @Allow()
  @Transform((value) => {
    return Number(value.value) || 1;
  })
  page?: number;

  @Allow()
  limit?: number;

  @ApiPropertyOptional({ example: 'factory', description: '' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    example: [{ columm: 'name', text: 'abc' }],
    description: '',
  })
  @IsOptional()
  @Transform((data) => JSON.parse(data.value))
  @IsArray()
  @Type(() => Filter)
  filter?: Filter[];

  @ApiPropertyOptional({
    example: [{ columm: 'name', order: 'DESC' }],
    description: '',
  })
  @Transform((data) => JSON.parse(data.value))
  @Type(() => Sort)
  @IsArray()
  @IsOptional()
  sort?: Sort[];

  get take(): number {
    const limit = Number(this.limit) || 10;

    return limit > 0 && limit <= 200 ? limit : 10;
  }

  get skip(): number {
    const page = (Number(this.page) || 1) - 1;

    return (page < 0 ? 0 : page) * this.take;
  }

  @IsInt()
  @Transform(({ value }) => +value)
  @IsOptional()
  isGetAll: number;
}
