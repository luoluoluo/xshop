import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { getRedisConnectionOptions } from '../../../core/redis.config';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;

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
      console.error('Redis get error:', error);
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
      console.error('Redis set error:', error);
    }
  }

  /**
   * 删除缓存
   */
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Redis del error:', error);
    }
  }

  /**
   * 清空所有缓存
   */
  async reset(): Promise<void> {
    try {
      await this.redis.flushdb();
    } catch (error) {
      console.error('Redis reset error:', error);
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
      console.error('Redis has error:', error);
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
