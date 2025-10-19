import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Withdrawal } from '@/entities/withdrawal.entity';
import { User } from '@/entities/user.entity';
import { WithdrawalResolver } from './withdrawal.resolver';
import { WithdrawalService } from './withdrawal.service';
import { AuthModule } from '@/modules/_common/auth/auth.module';
@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User, Withdrawal, User])],
  providers: [WithdrawalService, WithdrawalResolver],
  exports: [WithdrawalService],
})
export class WithdrawalModule {}
