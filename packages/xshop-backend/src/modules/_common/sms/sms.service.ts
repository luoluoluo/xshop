import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import AlismsService from './alisms.service';

export interface SmsVerificationCode {
  code: string;
  attempts: number;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly MAX_ATTEMPTS = 3;
  private readonly CODE_EXPIRATION_SECONDS = 5 * 60; // 5 minutes in seconds
  private readonly RESEND_SECONDS = 60;
  private readonly REDIS_KEY_PREFIX = 'sms:verification:';
  private readonly ATTEMPTS_KEY_PREFIX = 'sms:attempts:';

  constructor(
    private readonly redisService: RedisService,
    private readonly alismsService: AlismsService,
  ) {}

  /**
   * 生成4位数字验证码
   */
  private generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  /**
   * 获取验证码Redis键名
   */
  private getCodeRedisKey(phone: string): string {
    return `${this.REDIS_KEY_PREFIX}${phone}`;
  }

  /**
   * 获取尝试次数Redis键名
   */
  private getAttemptsRedisKey(phone: string): string {
    return `${this.ATTEMPTS_KEY_PREFIX}${phone}`;
  }

  /**
   * 发送验证码
   */
  async sendCode(phone: string): Promise<boolean> {
    try {
      // 存储验证码到Redis，使用Redis TTL
      const codeRedisKey = this.getCodeRedisKey(phone);

      // 60s 无法重新发送
      const ttl = await this.redisService.getRedis().ttl(codeRedisKey);

      if (ttl > 0 && ttl > this.CODE_EXPIRATION_SECONDS - this.RESEND_SECONDS) {
        throw new BadRequestException(`请勿频繁发送验证码`);
      }
      // 生成验证码
      const code = this.generateVerificationCode();

      this.logger.debug(`Phone SmsCode: ${code}`);

      await this.redisService.set(
        codeRedisKey,
        code,
        this.CODE_EXPIRATION_SECONDS,
      );

      // 重置尝试次数
      const attemptsRedisKey = this.getAttemptsRedisKey(phone);
      await this.redisService.set(
        attemptsRedisKey,
        '0',
        this.CODE_EXPIRATION_SECONDS,
      );
      await this.alismsService.sendCode(phone, code);
      return true;
    } catch (error) {
      this.logger.error('发送验证码失败', {
        error,
        phone,
      });
      throw error;
    }
  }

  /**
   * 验证验证码
   */
  async verifyCode(phone: string, code: string): Promise<boolean> {
    try {
      const codeRedisKey = this.getCodeRedisKey(phone);
      const attemptsRedisKey = this.getAttemptsRedisKey(phone);

      // 获取存储的验证码
      const storedCode = await this.redisService.get(codeRedisKey);
      if (!storedCode) {
        throw new Error('验证码无效或已过期');
      }

      // 获取当前尝试次数
      const attemptsStr = await this.redisService.get(attemptsRedisKey);
      const attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;

      // 检查尝试次数
      if (attempts >= this.MAX_ATTEMPTS) {
        // 清理Redis数据
        await this.redisService.del(codeRedisKey);
        await this.redisService.del(attemptsRedisKey);
        throw new Error('验证码尝试次数过多，请重新发送');
      }

      // 验证码正确
      if (storedCode === code) {
        // 验证成功后删除验证码和尝试次数
        await this.redisService.del(codeRedisKey);
        await this.redisService.del(attemptsRedisKey);
        return true;
      }

      // 验证码错误，增加尝试次数
      const newAttempts = attempts + 1;
      await this.redisService.set(
        attemptsRedisKey,
        newAttempts.toString(),
        this.CODE_EXPIRATION_SECONDS,
      );

      // 检查是否超过最大尝试次数
      if (newAttempts >= this.MAX_ATTEMPTS) {
        await this.redisService.del(codeRedisKey);
        await this.redisService.del(attemptsRedisKey);
        throw new Error('验证码尝试次数过多，请重新发送');
      }

      return false;
    } catch (error) {
      this.logger.error('验证验证码失败', {
        error,
        phone,
      });
      return false;
    }
  }

  /**
   * 获取验证码状态（用于调试）
   */
  async getVerificationCodeStatus(
    phone: string,
  ): Promise<SmsVerificationCode | null> {
    try {
      const codeRedisKey = this.getCodeRedisKey(phone);
      const attemptsRedisKey = this.getAttemptsRedisKey(phone);

      const storedCode = await this.redisService.get(codeRedisKey);
      const attemptsStr = await this.redisService.get(attemptsRedisKey);

      if (!storedCode) {
        return null;
      }

      const attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;

      return {
        code: storedCode,
        attempts,
      };
    } catch (error) {
      this.logger.error('清理过期验证码失败', {
        error,
      });
      return null;
    }
  }

  sendInvite(phone: string, data: { mch: string; uid: string }) {
    return this.alismsService.sendInvite(phone, data);
  }
}
