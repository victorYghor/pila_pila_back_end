import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('int')
  amount: number;

  @Column()
  description: string;

  @Column()
  tag: string;

  @Column('datetime')
  date: Date;
}
