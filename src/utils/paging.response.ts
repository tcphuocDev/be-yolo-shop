import { Expose } from 'class-transformer';

export class PagingResponse {
  @Expose()
  items: any;

  @Expose()
  meta?: unknown;
}
