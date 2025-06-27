import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffiliateService } from './affiliate.service';
import { Affiliate } from '@/entities/affiliate.entity';
import { Order } from '@/entities/order.entity';

@Module({
  imports: [AffiliateModule, TypeOrmModule.forFeature([Affiliate, Order])],
  providers: [AffiliateService],
  exports: [AffiliateService],
})
export class AffiliateModule {}
