// auth/jwt.strategy.ts
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { CRM_JWT_STRATEGY } from '@/core/constants';
import { getPassportJwtOptions } from '../../../../core/auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, CRM_JWT_STRATEGY) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super(getPassportJwtOptions(configService));
  }

  async validate(payload: any) {
    try {
      const user = await this.authService.validateAffiliate(payload);
      return user;
    } catch (e) {
      this.logger.error('CRM JWT策略驗證失敗', {
        error: e,
        payload,
      });
      throw new UnauthorizedException(e?.message || 'Unauthorized');
    }
  }
}
