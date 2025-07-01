import { Module } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from '@/entities/merchant.entity';
import { Affiliate } from '@/entities/affiliate.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Merchant, Affiliate])],
  providers: [MerchantService],
  exports: [MerchantService],
})
export class MerchantModule {}
