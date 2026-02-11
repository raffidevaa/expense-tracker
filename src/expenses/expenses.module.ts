import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Expense } from './expenses.entities';
import { ExpensesRepository } from './expenses.repository';
import { Category } from 'src/categories/categories.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Category]), UsersModule],
  controllers: [ExpensesController],
  providers: [ExpensesService, ExpensesRepository],
})
export class ExpensesModule {}
