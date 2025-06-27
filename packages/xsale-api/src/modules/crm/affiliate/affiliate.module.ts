import { Module } from '@nestjs/common';
import { AffiliateService } from './affiliate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Affiliate } from '@/entities/affiliate.entity';
import { Role } from '@/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Affiliate, Role])],
  providers: [AffiliateService],
  exports: [AffiliateService],
})
export class AffiliateModule {}
