import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { getRedisConnectionOptions } from '../../../core/redis.config';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {
    const { url, options } = getRedisConnectionOptions(this.configService);
    this.redis = new Redis(url, options);

    this.redis.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    this.redis.on('connect', () => {
      console.log('Redis connected successfully');
    });
  }

  /**
   * 获取缓存值
   */
  async get(key: string): Promise<string | null> {
    try {
      const value = await this.redis.get(key);
      return value;
    } catch (error) {
      this.logger.error('Redis get error:', {
        error,
        key,
      });
      return null;
    }
  }

  /**
   * 设置缓存值
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.redis.setex(key, ttl, value);
      } else {
        await this.redis.set(key, value);
      }
    } catch (error) {
      this.logger.error('Redis set error:', {
        error,
        key,
        value: value.length > 100 ? value.substring(0, 100) + '...' : value,
        ttl,
      });
    }
  }

  /**
   * 删除缓存
   */
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.error('Redis del error:', {
        error,
        key,
      });
    }
  }

  /**
   * 清空所有缓存
   */
  async reset(): Promise<void> {
    try {
      await this.redis.flushdb();
    } catch (error) {
      this.logger.error('Redis reset error:', {
        error,
      });
    }
  }

  /**
   * 检查键是否存在
   */
  async has(key: string): Promise<boolean> {
    try {
      const exists = await this.redis.exists(key);
      return exists === 1;
    } catch (error) {
      this.logger.error('Redis has error:', {
        error,
        key,
      });
      return false;
    }
  }

  /**
   * 获取Redis实例（用于高级操作）
   */
  getRedis(): Redis {
    return this.redis;
  }

  /**
   * 模块销毁时关闭Redis连接
   */
  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}
