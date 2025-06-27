import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from '@/entities/merchant.entity';
import { AffiliateWithdrawal } from '@/entities/affiliate-withdrawal.entity';
import { Affiliate } from '@/entities/affiliate.entity';
import { Order } from '@/entities/order.entity';
import { AffiliateWithdrawalResolver } from './affiliate-withdrawal.resolver';
import { AffiliateWithdrawalService } from './affiliate-withdrawal.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Merchant, AffiliateWithdrawal, Affiliate, Order]),
  ],
  providers: [AffiliateWithdrawalService, AffiliateWithdrawalResolver],
  exports: [AffiliateWithdrawalService],
})
export class AffiliateWithdrawalModule {}
