// auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { CRM_JWT_STRATEGY } from '@/core/constants';
import { getPassportJwtOptions } from '../../../../core/auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, CRM_JWT_STRATEGY) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super(getPassportJwtOptions(configService));
  }

  async validate(payload: any) {
    console.log('CRM JWT Strategy validate called with payload:', payload);
    try {
      return this.authService.validateAffiliate(payload);
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
