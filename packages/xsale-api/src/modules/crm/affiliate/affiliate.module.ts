import { Module } from '@nestjs/common';
import { AffiliateService } from './affiliate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Affiliate } from '@/entities/affiliate.entity';
import { WechatOAuth } from '@/entities/wechat-oauth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Affiliate, WechatOAuth])],
  providers: [AffiliateService],
  exports: [AffiliateService],
})
export class AffiliateModule {}
