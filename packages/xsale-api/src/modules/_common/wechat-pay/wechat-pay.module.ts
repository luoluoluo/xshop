import { Module } from '@nestjs/common';
import { WechatPayService } from './wechat-pay.service';
import { WechatPayController } from './wechat-pay.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [WechatPayController],
  providers: [WechatPayService],
  exports: [WechatPayService],
})
export class WechatPayModule {}
