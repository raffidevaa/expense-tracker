import { Entity, Column, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/users.entities';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('float')
  balance: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @RelationId((account: Account) => account.user)
  user_id: string;
}
