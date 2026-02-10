import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { CreateAccountDto } from './accounts.dto';
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
}
