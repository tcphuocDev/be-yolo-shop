import { Expose } from 'class-transformer';

export class AddressResponse {
  @Expose()
  id: number;

  @Expose()
  address: string;
}
