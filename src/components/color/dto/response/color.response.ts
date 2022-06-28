import { Expose } from 'class-transformer';

export class ColorResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
