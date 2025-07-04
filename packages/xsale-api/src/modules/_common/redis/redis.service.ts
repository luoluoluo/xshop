import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD', ''),
      db: this.configService.get('REDIS_DB', 0),
    });

    this.client.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    this.client.on('connect', () => {
      console.log('Redis connected successfully');
    });
  }

  /**
   * 获取缓存值
   */
  async get(key: string): Promise<string | null> {
    try {
      const value = await this.client.get(key);
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
        await this.client.setex(key, ttl, value);
      } else {
        await this.client.set(key, value);
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
      await this.client.del(key);
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
      await this.client.flushdb();
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
      const exists = await this.client.exists(key);
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
    return this.client;
  }

  /**
   * 模块销毁时关闭Redis连接
   */
  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  /**
   * 获取键的剩余生存时间（秒）
   * @param key Redis键
   * @returns 剩余时间（秒）。-2表示键不存在，-1表示键没有过期时间
   */
  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }

  /**
   * 将键的整数值加1
   * @param key Redis键
   * @returns 加1后的值
   */
  async incr(key: string): Promise<number> {
    return await this.client.incr(key);
  }

  /**
   * 设置键的过期时间
   * @param key Redis键
   * @param seconds 过期时间（秒）
   * @returns 1表示成功，0表示键不存在或设置失败
   */
  async expire(key: string, seconds: number): Promise<number> {
    return await this.client.expire(key, seconds);
  }

  /**
   * 设置键的值和过期时间
   * @param key Redis键
   * @param seconds 过期时间（秒）
   * @param value 值
   * @returns "OK"表示成功
   */
  async setex(key: string, seconds: number, value: string): Promise<'OK'> {
    return await this.client.setex(key, seconds, value);
  }
}
