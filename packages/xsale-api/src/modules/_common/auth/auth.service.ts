import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CommonAuthService {
  private readonly MAX_ATTEMPTS = 5; // 最大尝试次数
  private readonly LOCK_TIME = 15 * 60; // 锁定时间（秒）

  constructor(private readonly redisService: RedisService) {}

  private getKey(identifier: string): string {
    return `login:attempts:${identifier}`;
  }

  /**
   * 检查是否被锁定
   * @param identifier 标识符（如手机号、用户名等）
   * @returns 如果被锁定返回剩余锁定时间（秒），否则返回0
   */
  async isLocked(identifier: string): Promise<number> {
    const key = this.getKey(identifier);
    const attempts = await this.redisService.get(key);
    if (!attempts) return 0;

    const count = parseInt(attempts, 10);
    if (count >= this.MAX_ATTEMPTS) {
      const ttl = await this.redisService.ttl(key);
      return ttl > 0 ? ttl : 0;
    }
    return 0;
  }

  /**
   * 记录登录失败
   * @param identifier 标识符（如手机号、用户名等）
   * @returns 剩余尝试次数
   */
  async recordFailedAttempt(identifier: string): Promise<number> {
    const key = this.getKey(identifier);
    const attempts = await this.redisService.incr(key);

    // 第一次失败时设置过期时间
    if (attempts === 1) {
      await this.redisService.expire(key, this.LOCK_TIME);
    }

    return Math.max(0, this.MAX_ATTEMPTS - attempts);
  }

  /**
   * 重置登录尝试次数
   * @param identifier 标识符（如手机号、用户名等）
   */
  async resetAttempts(identifier: string): Promise<void> {
    const key = this.getKey(identifier);
    await this.redisService.del(key);
  }

  /**
   * 获取剩余尝试次数
   * @param identifier 标识符（如手机号、用户名等）
   * @returns 剩余尝试次数
   */
  async getRemainingAttempts(identifier: string): Promise<number> {
    const key = this.getKey(identifier);
    const attempts = await this.redisService.get(key);
    return attempts
      ? Math.max(0, this.MAX_ATTEMPTS - parseInt(attempts, 10))
      : this.MAX_ATTEMPTS;
  }
}
