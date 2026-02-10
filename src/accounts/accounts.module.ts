import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountsRepository } from './accounts.repository';
import { Account } from './accounts.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), UsersModule],
  controllers: [AccountsController],
  providers: [AccountsService, AccountsRepository],
  exports: [AccountsRepository],
})
export class AccountsModule {}
