import { Module } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from '@/entities/merchant.entity';
import { Role } from '@/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant, Role])],
  providers: [MerchantService],
  exports: [MerchantService],
})
export class MerchantModule {}
