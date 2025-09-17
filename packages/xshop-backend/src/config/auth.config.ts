// src/core/config/auth.config.ts
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';

export const getJwtSecret = (configService: ConfigService): string => {
  return configService.get<string>('JWT_SECRET') || '';
};

export const getJwtExpiresIn = (): number => 3600 * 24 * 7;

export const getJwtOptions = (configService: ConfigService) => ({
  secret: getJwtSecret(configService),
  signOptions: { expiresIn: getJwtExpiresIn() },
});

export const getPassportJwtOptions = (configService: ConfigService) => ({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: getJwtSecret(configService),
});
