import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './expenses.entities';

@Injectable()
export class ExpensesRepository {
  constructor(
    @InjectRepository(Expense)
    private readonly repo: Repository<Expense>,
  ) {}

  createExpense(data: Partial<Expense>): Promise<Expense> {
    const expense = this.repo.create(data);
    return this.repo.save(expense);
  }
}
