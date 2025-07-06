import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AffiliateService } from '../affiliate/affiliate.service';
import { SmsService } from '../../_common/sms/sms.service';
import {
  AuthPayload,
  AuthToken,
  LoginInput,
  RegisterInput,
  SendSmsCodeInput,
  SmsCodeType,
} from './auth.dto';
import { Affiliate } from '@/entities/affiliate.entity';
import { getJwtExpiresIn } from '../../../core/auth.config';
import { Logger } from '@nestjs/common';
import { compare } from 'bcrypt';
import { CommonAuthService } from '../../_common/auth/auth.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly affiliateService: AffiliateService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
    private readonly commonAuthService: CommonAuthService,
  ) {}

  async validateAffiliate(payload: AuthPayload): Promise<Affiliate> {
    try {
      const affiliate = await this.affiliateService.findOne(payload.sub);
      if (!affiliate) {
        this.logger.warn('Affiliate not found during validation', {
          affiliateId: payload.sub,
          timestamp: new Date().toISOString(),
        });
        throw new UnauthorizedException('用戶未找到');
      }
      return affiliate;
    } catch (error) {
      this.logger.error('Error validating affiliate', {
        affiliateId: payload.sub,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('驗證用戶時發生錯誤');
    }
  }

  private getAuthToken(affiliate: Affiliate): AuthToken {
    const iat = Math.floor(Date.now() / 1000);
    const expiresIn = getJwtExpiresIn();
    const payload: AuthPayload = {
      sub: affiliate.id!,
      iat,
    };
    return {
      token: this.jwtService.sign(payload, {
        expiresIn,
      }),
      affiliate,
      expiresIn,
    };
  }

  async sendSmsCode(sendSmsCodeInput: SendSmsCodeInput): Promise<boolean> {
    const { phone, type } = sendSmsCodeInput;

    try {
      // 根据验证码类型进行不同的业务校验
      const existingAffiliate = await this.affiliateService.findByPhone(phone);

      if (type === SmsCodeType.REGISTER) {
        // 注册验证码：检查手机号是否已注册
        if (existingAffiliate) {
          this.logger.warn('Phone already registered', {
            phone,
            type,
            timestamp: new Date().toISOString(),
          });
          throw new BadRequestException('该手机号已注册，请直接登录');
        }
      } else if (type === SmsCodeType.LOGIN) {
        // 登录验证码：检查账号是否存在
        if (!existingAffiliate) {
          this.logger.warn('Account not found for SMS login', {
            phone,
            type,
            timestamp: new Date().toISOString(),
          });
          throw new BadRequestException('账号不存在，请先注册');
        }
      }

      const result = await this.smsService.sendCode(phone);
      if (result) {
        this.logger.log('SMS code sent successfully', {
          phone,
          type,
          timestamp: new Date().toISOString(),
        });
      }
      return result;
    } catch (error) {
      this.logger.error('Error sending SMS code', {
        phone,
        type,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('发送验证码失败');
    }
  }

  async login(loginInput: LoginInput): Promise<AuthToken> {
    try {
      // 查找推广者
      const affiliate = await this.affiliateService.findByPhone(
        loginInput.phone,
      );
      if (!affiliate) {
        this.logger.warn('Account not found', {
          phone: loginInput.phone,
          timestamp: new Date().toISOString(),
        });
        throw new UnauthorizedException('账号不存在，请先注册');
      }

      // 如果提供了密码，使用密码登录
      if (loginInput.password) {
        // Check if the account is locked
        const lockTime = await this.commonAuthService.isLocked(
          loginInput.phone,
        );
        if (lockTime > 0) {
          this.logger.warn('Account locked', {
            phone: loginInput.phone,
            lockTimeMinutes: Math.ceil(lockTime / 60),
            timestamp: new Date().toISOString(),
          });
          throw new UnauthorizedException(
            `账号已被锁定，请${Math.ceil(lockTime / 60)}分钟后重试`,
          );
        }

        const isPasswordValid = await compare(
          loginInput.password,
          affiliate.password || '',
        );
        if (!isPasswordValid) {
          const remainingAttempts =
            await this.commonAuthService.recordFailedAttempt(loginInput.phone);
          this.logger.warn('Failed password login attempt', {
            phone: loginInput.phone,
            remainingAttempts,
            timestamp: new Date().toISOString(),
            attemptCount: 5 - remainingAttempts,
          });
          if (remainingAttempts > 0) {
            throw new UnauthorizedException(
              `密码错误，剩余${remainingAttempts}次尝试机会`,
            );
          } else {
            throw new UnauthorizedException('登录尝试次数过多，账号已被锁定');
          }
        }
        // Reset attempts on successful password login
        await this.commonAuthService.resetAttempts(loginInput.phone);
        this.logger.log('Successful password login', {
          phone: loginInput.phone,
          affiliateId: affiliate.id,
          timestamp: new Date().toISOString(),
        });
      }
      // 如果提供了验证码，使用验证码登录
      else if (loginInput.smsCode) {
        const isCodeValid = await this.smsService.verifyCode(
          loginInput.phone,
          loginInput.smsCode,
        );
        if (!isCodeValid) {
          this.logger.warn('Invalid SMS code', {
            phone: loginInput.phone,
            timestamp: new Date().toISOString(),
          });
          throw new UnauthorizedException('验证码错误');
        }
        // Reset attempts when using SMS code login
        await this.commonAuthService.resetAttempts(loginInput.phone);
        this.logger.log('Successful SMS code login', {
          phone: loginInput.phone,
          affiliateId: affiliate.id,
          timestamp: new Date().toISOString(),
        });
      } else {
        throw new BadRequestException('请提供密码或验证码');
      }

      try {
        const token = this.getAuthToken(affiliate);
        return token;
      } catch (tokenError) {
        this.logger.error('Error generating auth token', {
          phone: loginInput.phone,
          affiliateId: affiliate.id,
          error:
            tokenError instanceof Error ? tokenError.message : 'Unknown error',
          stack: tokenError instanceof Error ? tokenError.stack : undefined,
          timestamp: new Date().toISOString(),
        });
        throw new InternalServerErrorException('生成令牌時發生錯誤');
      }
    } catch (error) {
      this.logger.error('Login error', {
        phone: loginInput.phone,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('登錄時發生錯誤');
    }
  }

  async register(registerInput: RegisterInput): Promise<AuthToken> {
    // 验证验证码
    const isCodeValid = await this.smsService.verifyCode(
      registerInput.phone,
      registerInput.smsCode,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('验证码错误');
    }

    // 创建推广者
    const affiliate = await this.affiliateService.create({
      phone: registerInput.phone,
      name: registerInput.name,
      password: registerInput.password,
    });

    return this.getAuthToken(affiliate);
  }
}
