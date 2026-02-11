import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { CreateAccountDto, UpdateAccountDto } from './accounts.dto';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AccountsService {
  constructor(
    private accountRepo: AccountsRepository,
    private userRepo: UsersRepository,
  ) {}

  async createAccount(userId: string, dto: CreateAccountDto) {
    const user = await this.userRepo.findById(userId);
    if (user == null) {
      throw new Error('User not found');
    }

    const account = this.accountRepo.createAccount({
      name: dto.name,
      balance: dto.balance,
      user: user,
    });

    return account;
  }

  async updateAccount(accountId: string, dto: Partial<UpdateAccountDto>) {
    const exist = await this.accountRepo.findAccountById(accountId);
    if (exist == null) {
      throw new Error('Account not found');
    }

    const updatedAccount = await this.accountRepo.updateAccount(accountId, {
      name: dto.name,
      balance: dto.balance,
      user: exist.user,
    });

    return updatedAccount;
  }

  async getAccountsByUserId(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (user == null) {
      throw new Error('User not found');
    }

    const accounts = await this.accountRepo.findAllAccountsByUserId(userId);

    return accounts;
  }

  async deleteAccount(accountId: string) {
    const exist = await this.accountRepo.findAccountById(accountId);
    if (exist == null) {
      throw new Error('Account not found');
    }

    await this.accountRepo.deleteAccount(accountId);
  }
}
