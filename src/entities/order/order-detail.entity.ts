import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('order_details')
export class OrderDetailEntity {
  @PrimaryColumn()
  orderId: number;

  @PrimaryColumn()
  productVersionId: number;

  @Column()
  quantity: number;
}
