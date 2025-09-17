import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthPayload, AuthToken } from './auth.dto';
import { User } from '@/entities/user.entity';
import { getJwtExpiresIn } from '../../../config/auth.config';
import { CommonAuthService } from '../../_common/auth/auth.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly commonAuthService: CommonAuthService,
  ) {}

  async validateUser(payload: AuthPayload): Promise<User> {
    const user = await this.userService.findOne(payload.sub);

    if (!user) {
      throw new UnauthorizedException('用戶未找到');
    }
    return user;
  }

  async login(email: string, password: string): Promise<AuthToken> {
    // Check if the account is locked
    const lockTime = await this.commonAuthService.isLocked(email);
    if (lockTime > 0) {
      throw new UnauthorizedException(
        `账号已被锁定，请${Math.ceil(lockTime / 60)}分钟后重试`,
      );
    }

    const user = await this.userService.validateUser(email, password);
    if (!user) {
      const remainingAttempts =
        await this.commonAuthService.recordFailedAttempt(email);
      if (remainingAttempts > 0) {
        throw new UnauthorizedException(
          `電郵或密碼錯誤，剩余${remainingAttempts}次尝试机会`,
        );
      } else {
        throw new UnauthorizedException('登录尝试次数过多，账号已被锁定');
      }
    }

    // Reset attempts on successful login
    await this.commonAuthService.resetAttempts(email);

    const iat = Math.floor(Date.now() / 1000);
    const expiresIn = getJwtExpiresIn();

    const payload: AuthPayload = {
      sub: user.id,
      iat,
    };

    return {
      token: this.jwtService.sign(payload, {
        expiresIn,
      }),
      user: { ...user, password: '' },
      expiresIn,
    };
  }
}
