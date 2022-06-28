import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('colors')
export class ColorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
