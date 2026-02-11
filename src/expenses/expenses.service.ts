import { Injectable } from '@nestjs/common';
import { ExpensesRepository } from './expenses.repository';
import { CreateExpenseDto } from './expenses.dto';

@Injectable()
export class ExpensesService {
  constructor(private expensesRepo: ExpensesRepository) {}

  async createExpense(dto: CreateExpenseDto) {
    const expense = await this.expensesRepo.createExpense(dto);

    return expense;
  }
}
