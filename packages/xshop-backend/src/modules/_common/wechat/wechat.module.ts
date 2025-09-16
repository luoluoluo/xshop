import { Module } from '@nestjs/common';
import { WechatService } from './wechat.service';
import { WechatResolver } from './wechat.resolver';
import { WechatMessageService } from './wechat-message.service';
import { WechatConfigService } from './wechat-config.service';
import { WechatEventService } from './wechat-event.service';
import { WechatController } from './wechat.controller';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [WechatController],
  providers: [
    WechatService,
    WechatResolver,
    WechatMessageService,
    WechatConfigService,
    WechatEventService,
  ],
  exports: [
    WechatService,
    WechatMessageService,
    WechatConfigService,
    WechatEventService,
  ],
})
export class WechatModule {}
