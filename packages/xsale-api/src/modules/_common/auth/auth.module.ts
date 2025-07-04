import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { CommonAuthService } from './auth.service';

@Module({
  imports: [RedisModule],
  providers: [CommonAuthService],
  exports: [CommonAuthService],
})
export class AuthModule {}
