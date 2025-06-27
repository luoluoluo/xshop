import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from '@/entities/merchant.entity';
import { MerchantWithdrawal } from '@/entities/merchant-withdrawal.entity';
import { User } from '@/entities/user.entity';
import { MerchantWithdrawalResolver } from './merchant-withdrawal.resolver';
import { MerchantWithdrawalService } from './merchant-withdrawal.service';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant, MerchantWithdrawal, User])],
  providers: [MerchantWithdrawalService, MerchantWithdrawalResolver],
  exports: [MerchantWithdrawalService],
})
export class MerchantWithdrawalModule {}
