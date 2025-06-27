import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { RedisModule } from '../redis/redis.module';
import AlismsService from './alisms.service';

@Module({
  imports: [RedisModule],
  providers: [SmsService, AlismsService],
  exports: [SmsService, AlismsService],
})
export class SmsModule {}
