import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffiliateService } from './affiliate.service';
import { AffiliateResolver } from './affiliate.resolver';
import { Affiliate } from '@/entities/affiliate.entity';
import { MerchantAffiliate } from '@/entities/merchant-affiliate.entity';
import { User } from '@/entities/user.entity';
import { SmsModule } from '@/modules/_common/sms/sms.module';
import { ShortLinkModule } from '@/modules/_common/short-link/short-link.module';
import { CommonJwtModule } from '@/modules/_common/jwt/jwt.module';

@Module({
  imports: [
    SmsModule,
    ShortLinkModule,
    CommonJwtModule,
    TypeOrmModule.forFeature([Affiliate, MerchantAffiliate, User]),
  ],
  providers: [AffiliateService, AffiliateResolver],
  exports: [AffiliateService],
})
export class AffiliateModule {}
