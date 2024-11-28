import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users') // 테이블 이름: users
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
}
