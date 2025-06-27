import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

export const getRedisConnectionOptions = (
  configService: ConfigService,
): { url: string; options: RedisOptions } => {
  const redisUrl = configService.get('REDIS_URL', 'redis://localhost:6379');

  return {
    url: redisUrl,
    options: {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    },
  };
};
