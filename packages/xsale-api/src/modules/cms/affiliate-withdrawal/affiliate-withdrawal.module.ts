import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Affiliate } from '@/entities/affiliate.entity';
import { AffiliateWithdrawal } from '@/entities/affiliate-withdrawal.entity';
import { User } from '@/entities/user.entity';
import { AffiliateWithdrawalResolver } from './affiliate-withdrawal.resolver';
import { AffiliateWithdrawalService } from './affiliate-withdrawal.service';

@Module({
  imports: [TypeOrmModule.forFeature([Affiliate, AffiliateWithdrawal, User])],
  providers: [AffiliateWithdrawalService, AffiliateWithdrawalResolver],
  exports: [AffiliateWithdrawalService],
})
export class AffiliateWithdrawalModule {}
