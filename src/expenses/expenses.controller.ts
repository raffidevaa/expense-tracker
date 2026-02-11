import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './expenses.dto';
import * as authGuard from '../auth/auth.guard';

@UseGuards(authGuard.AuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createExpense(@Body() dto: CreateExpenseDto) {
    return this.expensesService.createExpense(dto);
  }
}
