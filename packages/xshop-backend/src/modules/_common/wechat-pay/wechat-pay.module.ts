import { Module } from '@nestjs/common';
import { WechatPayService } from './wechat-pay.service';
import { WechatPayController } from './wechat-pay.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WechatPayPartnerService } from './wechat-pay-partner.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [WechatPayController],
  providers: [WechatPayService, WechatPayPartnerService],
  exports: [WechatPayService, WechatPayPartnerService],
})
export class WechatPayModule {}
