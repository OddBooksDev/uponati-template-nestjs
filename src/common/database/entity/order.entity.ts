import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  item: string;

  @Column()
  quantity: number;

  @Column({ nullable: true }) // 새로 추가될 컬럼
  status?: string;
}
