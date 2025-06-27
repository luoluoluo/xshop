import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffiliateService } from './affiliate.service';
import { AffiliateResolver } from './affiliate.resolver';
import { Affiliate } from '@/entities/affiliate.entity';
import { User } from '@/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Affiliate, User])],
  providers: [AffiliateService, AffiliateResolver],
  exports: [AffiliateService],
})
export class AffiliateModule {}
