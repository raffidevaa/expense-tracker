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

  async updateExpense(
    id: string,
    data: DeepPartial<Expense>,
  ): Promise<Expense> {
    await this.repo.update(id, data);

    const updatedExpense = await this.repo.findOne({
      where: { id },
    });

    if (!updatedExpense) {
      throw new Error(`Expense with id ${id} not found`);
    }

    return updatedExpense;
  }

  findExpenseById(id: string): Promise<Expense | null> {
    return this.repo.findOne({
      where: { id },
    });
  }

  getAllExpensesByAccountID(accountId: string): Promise<Expense[]> {
    return this.repo.find({ where: { account: { id: accountId } } });
  }

  deleteExpense(id: string): Promise<void> {
    return this.repo.delete(id).then(() => undefined);
  }

  getTotalSpending(userId: string): Promise<number> {
    return this.repo
      .createQueryBuilder('expense')
      .leftJoin('expense.account', 'account')
      .select('SUM(expense.amount)', 'total_spending')
      .where('account.user_id = :userId', { userId })
      .andWhere('expense.type = :type', { type: 'EXPENSE' })
      .getRawOne()
      .then(
        (result: { total_spending: string | null }) =>
          Number(result?.total_spending) || 0,
      );
  }

  getTotalIncome(userId: string): Promise<number> {
    return this.repo
      .createQueryBuilder('expense')
      .leftJoin('expense.account', 'account')
      .select('SUM(expense.amount)', 'total_income')
      .where('account.user_id = :userId', { userId })
      .andWhere('expense.type = :type', { type: 'INCOME' })
      .getRawOne()
      .then(
        (result: { total_income: string | null }) =>
          Number(result?.total_income) || 0,
      );
  }
}
