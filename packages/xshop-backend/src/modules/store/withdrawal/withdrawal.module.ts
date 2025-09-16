import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Withdrawal } from '@/entities/withdrawal.entity';
import { WithdrawalResolver } from './withdrawal.resolver';
import { WithdrawalService } from './withdrawal.service';
import { User } from '@/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Withdrawal])],
  providers: [WithdrawalService, WithdrawalResolver],
  exports: [WithdrawalService],
})
export class WithdrawalModule {}
