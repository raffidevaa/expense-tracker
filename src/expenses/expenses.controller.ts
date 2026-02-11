import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  UseGuards,
  Param,
  Put,
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
}
