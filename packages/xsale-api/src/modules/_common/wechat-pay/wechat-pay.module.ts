import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { WechatPayService } from './wechat-pay.service';
import { WechatPayController } from './wechat-pay.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as express from 'express';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [WechatPayController],
  providers: [WechatPayService],
  exports: [WechatPayService],
})
export class WechatPayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 为微信支付回调配置text解析器，确保接收原始字符串
    consumer
      .apply(express.text({ type: 'application/json' }))
      .forRoutes('wechat-pay/notify');
  }
}
