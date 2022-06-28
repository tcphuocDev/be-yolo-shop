import { Expose } from 'class-transformer';

export class SizeResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
