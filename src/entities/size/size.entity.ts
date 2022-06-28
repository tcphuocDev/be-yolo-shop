import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sizes')
export class SizeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
