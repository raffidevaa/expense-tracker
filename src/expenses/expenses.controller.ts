import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  UseGuards,
  Param,
  Put,
  Get,
  Delete,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto } from './expenses.dto';
import * as authGuard from '../auth/auth.guard';

@UseGuards(authGuard.AuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  // create expense record
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createExpense(@Body() dto: CreateExpenseDto) {
    return this.expensesService.createExpense(dto);
  }

  // update expense record
  @HttpCode(HttpStatus.OK)
  @Put(':expense_id')
  updateExpense(
    @Param('expense_id') expenseId: string,
    @Body() dto: Partial<UpdateExpenseDto>,
  ) {
    return this.expensesService.updateExpense(expenseId, dto);
  }

  // get expense by id
  @HttpCode(HttpStatus.OK)
  @Get(':expense_id')
  getExpenseById(@Param('expense_id') expenseId: string) {
    return this.expensesService.getExpenseById(expenseId);
  }

  // get all expenses by account id
  @HttpCode(HttpStatus.OK)
  @Get('account/:account_id')
  getAllExpensesByAccountId(@Param('account_id') accountId: string) {
    return this.expensesService.getAllExpensesByAccountId(accountId);
  }

  // delete expense record
  @HttpCode(HttpStatus.OK)
  @Delete(':expense_id')
  deleteExpense(@Param('expense_id') expenseId: string) {
    return this.expensesService.deleteExpense(expenseId);
  }
}
