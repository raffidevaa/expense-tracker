import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Expense } from './expenses.entities';

@Injectable()
export class ExpensesRepository {
  constructor(
    @InjectRepository(Expense)
    private readonly repo: Repository<Expense>,
  ) {}

  createExpense(data: DeepPartial<Expense>): Promise<Expense> {
    const expense = this.repo.create(data);
    return this.repo.save(expense);
  }

  updateExpense(id: string, data: DeepPartial<Expense>): Promise<Expense> {
    return this.repo.save({ id, ...data });
  }

  findExpenseById(id: string): Promise<Expense | null> {
    return this.repo.findOne({ where: { id } });
  }

  getAllExpensesByAccountID(accountId: string): Promise<Expense[]> {
    return this.repo.find({ where: { account: { id: accountId } } });
  }
}
