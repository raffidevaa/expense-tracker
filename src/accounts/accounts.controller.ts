import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  Put,
  Param,
  Get,
} from '@nestjs/common';
import { Request } from 'express';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, UpdateAccountDto } from './accounts.dto';
import * as authGuard from '../auth/auth.guard';

@UseGuards(authGuard.AuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  // create account
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createAccount(
    @Req() req: authGuard.AuthenticatedRequest,
    @Body() dto: CreateAccountDto,
  ) {
    return this.accountsService.createAccount(req.user.sub, dto);
  }

  // update account
  @HttpCode(HttpStatus.OK)
  @Put(':account_id')
  updateAccount(
    @Param('account_id') accountId: string,
    @Body() dto: UpdateAccountDto,
  ) {
    return this.accountsService.updateAccount(accountId, dto);
  }

  // get all accounts by user id
  @HttpCode(HttpStatus.OK)
  @Get(':user_id')
  getAccountsByUserId(@Param('user_id') userId: string) {
    return this.accountsService.getAccountsByUserId(userId);
  }
}
