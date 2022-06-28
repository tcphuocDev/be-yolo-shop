import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SuccessResponse {
  @Expose()
  @ApiProperty({ example: 200 })
  statusCode: number;

  @Expose()
  @ApiProperty({ example: 'Success' })
  message: string;
}
