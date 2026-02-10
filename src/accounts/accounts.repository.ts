import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './accounts.entities';

@Injectable()
export class AccountsRepository {
  constructor(
    @InjectRepository(Account)
    private readonly repo: Repository<Account>,
  ) {}

  createAccount(data: Partial<Account>): Promise<Account> {
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
}
