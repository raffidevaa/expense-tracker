import { Injectable } from '@nestjs/common';
import { ExpensesRepository } from './expenses.repository';
import { CreateExpenseDto, UpdateExpenseDto } from './expenses.dto';

@Injectable()
export class ExpensesService {
  constructor(private expensesRepo: ExpensesRepository) {}

  async createExpense(dto: CreateExpenseDto) {
    const expense = await this.expensesRepo.createExpense(dto);

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
}
