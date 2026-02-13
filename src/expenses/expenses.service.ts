import { Injectable } from '@nestjs/common';
import { ExpensesRepository } from './expenses.repository';
import { CreateExpenseDto, Statistics, UpdateExpenseDto } from './expenses.dto';
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

    const account = await this.accountRepo.findAccountById(exist.account_id);
    if (account == null) {
      throw new Error('Account not found');
    }

    const oldAccount = account;
    const oldAmount = exist.amount;
    const oldType = exist.type;

    // rollback old balance
    if (oldType === (ExpenseType.EXPENSE as unknown as string)) {
      const newBalance = oldAccount.balance + Math.abs(oldAmount);
      await this.accountRepo.updateAccountBalance(oldAccount.id, newBalance);
    } else if (oldType === (ExpenseType.INCOME as unknown as string)) {
      const newBalance = oldAccount.balance - Math.abs(oldAmount);
      await this.accountRepo.updateAccountBalance(oldAccount.id, newBalance);
    }

    // check updated account
    const updatedAccount = await this.accountRepo.findAccountById(
      dto.account_id || oldAccount.id,
    );
    if (updatedAccount == null) {
      throw new Error('Account not found');
    }

    // apply new balance
    const newType = dto.type || oldType;
    const newAmount = dto.amount || oldAmount;

    if (newType === (ExpenseType.EXPENSE as unknown as string)) {
      const newBalance = updatedAccount.balance - Math.abs(newAmount);
      await this.accountRepo.updateAccountBalance(
        updatedAccount.id,
        newBalance,
      );
    } else if (newType === (ExpenseType.INCOME as unknown as string)) {
      const newBalance = updatedAccount.balance + Math.abs(newAmount);
      await this.accountRepo.updateAccountBalance(
        updatedAccount.id,
        newBalance,
      );
    } else {
      throw new Error('Invalid expense type');
    }

    const updatedExpense = await this.expensesRepo.updateExpense(expenseId, {
      type: newType,
      amount: newAmount,
      description: dto.description ?? exist.description,
      account: { id: updatedAccount.id },
      category: dto.category_id ? { id: dto.category_id } : exist.category,
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

    const account = await this.accountRepo.findAccountById(exist.account_id);
    if (account == null) {
      throw new Error('Account not found');
    }

    // rollback balance
    if (exist.type === (ExpenseType.EXPENSE as unknown as string)) {
      const newBalance = account.balance + Math.abs(exist.amount);
      await this.accountRepo.updateAccountBalance(account.id, newBalance);
    } else if (exist.type === (ExpenseType.INCOME as unknown as string)) {
      const newBalance = account.balance - Math.abs(exist.amount);
      await this.accountRepo.updateAccountBalance(account.id, newBalance);
    }

    return await this.expensesRepo.deleteExpense(expenseId);
  }

  async getStatistics(userId: string) {
    const balance = await this.accountRepo.getTotalBalanceByUserId(userId);
    const totalSpending = await this.expensesRepo.getTotalSpending(userId);
    const totalIncome = await this.expensesRepo.getTotalIncome(userId);
    const cashflow = totalIncome - totalSpending;

    const statistics: Statistics = {
      balance: balance,
      spending: totalSpending,
      cashflow: cashflow,
      income: totalIncome,
    };

    return statistics;
  }
}
