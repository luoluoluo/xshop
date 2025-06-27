import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantService } from './merchant.service';
import { MerchantResolver } from './merchant.resolver';
import { Merchant } from '@/entities/merchant.entity';
import { User } from '@/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant, User])],
  providers: [MerchantService, MerchantResolver],
  exports: [MerchantService],
})
export class MerchantModule {}
