import { Injectable } from '@nestjs/common';
import { ExpensesRepository } from './expenses.repository';
import { CreateExpenseDto, UpdateExpenseDto } from './expenses.dto';
import { AccountsRepository } from 'src/accounts/accounts.repository';

@Injectable()
export class ExpensesService {
  constructor(
    private expensesRepo: ExpensesRepository,
    private accountRepo: AccountsRepository,
  ) {}

  async createExpense(dto: CreateExpenseDto) {
    const expense = await this.expensesRepo.createExpense({
      description: dto.description,
      amount: dto.amount,
      account: dto.account_id ? { id: dto.account_id } : undefined,
      category: dto.category_id ? { id: dto.category_id } : undefined,
    });

    return expense;
  }

  async updateExpense(expenseId: string, dto: Partial<UpdateExpenseDto>) {
    const exist = await this.expensesRepo.findExpenseById(expenseId);
    if (exist == null) {
      throw new Error('Expense not found');
    }

    const updatedExpense = await this.expensesRepo.updateExpense(expenseId, {
      description: dto.description,
      amount: dto.amount,
      account: dto.account_id ? { id: dto.account_id } : undefined,
      category: dto.category_id ? { id: dto.category_id } : undefined,
    });

    return updatedExpense;
  }

  async getExpenseById(expenseId: string) {
    const expense = await this.expensesRepo.findExpenseById(expenseId);
    if (expense == null) {
      throw new Error('Expense not found');
    }

    return expense;
  }

  async getAllExpensesByAccountId(accountId: string) {
    const account = await this.accountRepo.findAccountById(accountId);
    if (account == null) {
      throw new Error('Account not found');
    }

    const expenses = await this.expensesRepo.getAllExpensesByAccountID(
      account.id,
    );

    return expenses;
  }
}
