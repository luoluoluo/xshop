// auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { CMS_JWT_STRATEGY } from '@/core/constants';
import { getPassportJwtOptions } from '../../../../core/auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, CMS_JWT_STRATEGY) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super(getPassportJwtOptions(configService));
  }

  async validate(payload: any) {
    try {
      const user = await this.authService.validateUser(payload);
      return user;
    } catch (e) {
      throw new UnauthorizedException(e?.message || 'Unauthorized');
    }
  }
}
