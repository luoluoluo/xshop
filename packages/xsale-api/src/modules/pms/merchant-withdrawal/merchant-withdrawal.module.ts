import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantWithdrawal } from '@/entities/merchant-withdrawal.entity';
import { Merchant } from '@/entities/merchant.entity';
import { MerchantWithdrawalResolver } from './merchant-withdrawal.resolver';
import { MerchantWithdrawalService } from './merchant-withdrawal.service';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant, MerchantWithdrawal])],
  providers: [MerchantWithdrawalService, MerchantWithdrawalResolver],
  exports: [MerchantWithdrawalService],
})
export class MerchantWithdrawalModule {}
