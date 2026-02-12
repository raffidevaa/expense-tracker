import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  RelationId,
} from 'typeorm';
import { ManyToOne, JoinColumn } from 'typeorm';
import { Account } from '../accounts/accounts.entities';
import { Category } from '../categories/categories.entities';
import { Exclude } from 'class-transformer';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column('float')
  amount: number;

  @Column()
  description: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  @Exclude()
  account: Account;

  @RelationId((expense: Expense) => expense.account)
  account_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  @Exclude()
  category: Category;

  @RelationId((expense: Expense) => expense.category)
  category_id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

export enum ExpenseType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}
