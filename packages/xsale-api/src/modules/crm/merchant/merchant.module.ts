import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantService } from './merchant.service';
import { MerchantResolver } from './merchant.resolver';
import { Merchant } from '@/entities/merchant.entity';
import { Affiliate } from '@/entities/affiliate.entity';
import { Order } from '@/entities/order.entity';
import { AffiliateModule } from '../affiliate/affiliate.module';

@Module({
  imports: [
    AffiliateModule,
    TypeOrmModule.forFeature([Merchant, Affiliate, Order]),
  ],
  providers: [MerchantService, MerchantResolver],
  exports: [MerchantService],
})
export class MerchantModule {}
