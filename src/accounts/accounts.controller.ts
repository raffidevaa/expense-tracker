import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './accounts.dto';
import * as authGuard from '../auth/auth.guard';

@UseGuards(authGuard.AuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createAccount(
    @Req() req: authGuard.AuthenticatedRequest,
    @Body() dto: CreateAccountDto,
  ) {
    return this.accountsService.createAccount(req.user.sub, dto);
  }
}
