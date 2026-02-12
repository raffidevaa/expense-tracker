import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Account } from './accounts.entities';

@Injectable()
export class AccountsRepository {
  constructor(
    @InjectRepository(Account)
    private readonly repo: Repository<Account>,
  ) {}

  createAccount(data: DeepPartial<Account>): Promise<Account> {
    const account = this.repo.create(data);
    return this.repo.save(account);
  }

  updateAccount(id: string, data: Partial<Account>): Promise<Account> {
    return this.repo.save({ id, ...data });
  }

  findAccountById(id: string): Promise<Account | null> {
    return this.repo.findOne({ where: { id } });
  }

  findAllAccountsByUserId(userId: string): Promise<Account[]> {
    return this.repo.find({ where: { user: { id: userId } } });
  }

  deleteAccount(id: string): Promise<void> {
    return this.repo.delete(id).then(() => undefined);
  }

  updateAccountBalance(id: string, updatedBalance: number): Promise<Account> {
    return this.repo.save({ id, balance: updatedBalance });
  }

  getTotalBalanceByUserId(userId: string): Promise<number> {
    return this.repo
      .createQueryBuilder('account')
      .select('SUM(account.balance)', 'total_balance')
      .where('account.user_id = :userId', { userId })
      .getRawOne()
      .then(
        (result: { total_balance: string | null }) =>
          Number(result?.total_balance) || 0,
      );
  }
}
