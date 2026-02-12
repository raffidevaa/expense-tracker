import { Injectable } from '@nestjs/common';
import { ExpensesRepository } from './expenses.repository';
import { CreateExpenseDto, UpdateExpenseDto } from './expenses.dto';
import { AccountsRepository } from 'src/accounts/accounts.repository';
import { ExpenseType } from './expenses.entities';

@Injectable()
export class ExpensesService {
  constructor(
    private expensesRepo: ExpensesRepository,
    private accountRepo: AccountsRepository,
  ) {}

  async createExpense(dto: CreateExpenseDto) {
    const account = await this.accountRepo.findAccountById(dto.account_id);
    if (account == null) {
      throw new Error('Account not found');
    }

    if (dto.type === (ExpenseType.EXPENSE as unknown as string)) {
      const newBalance = account.balance + -Math.abs(dto.amount);
      await this.accountRepo.updateAccountBalance(dto.account_id, newBalance);
    } else if (dto.type === (ExpenseType.INCOME as unknown as string)) {
      const newBalance = account.balance + Math.abs(dto.amount);
      await this.accountRepo.updateAccountBalance(dto.account_id, newBalance);
    } else {
      throw new Error('Invalid expense type');
    }

    const expense = await this.expensesRepo.createExpense({
      type: dto.type,
      amount: dto.amount,
      description: dto.description,
      account: { id: dto.account_id },
      category: { id: dto.category_id },
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
      account: { id: dto.account_id },
      category: { id: dto.category_id },
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

  async deleteExpense(expenseId: string) {
    const exist = await this.expensesRepo.findExpenseById(expenseId);
    if (exist == null) {
      throw new Error('Expense not found');
    }

    await this.expensesRepo.deleteExpense(expenseId);
  }
}
