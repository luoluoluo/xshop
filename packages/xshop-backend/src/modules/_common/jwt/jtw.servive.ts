import { getJwtExpiresIn, getJwtOptions } from '@/core/auth.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export class CommonJwtPayload {
  sub: string;
  iat: number;
}

@Injectable()
export class CommonJwtService {
  private jwtService: JwtService;

  constructor(private readonly configService: ConfigService) {
    this.jwtService = new JwtService(getJwtOptions(this.configService));
  }

  // 检验token
  verify(token: string) {
    return this.jwtService.verify<CommonJwtPayload>(token);
  }

  // 生成token
  sign(key: string, expiresIn?: number) {
    const iat = Math.floor(Date.now() / 1000);
    const payload = { sub: key, iat };
    return this.jwtService.sign(payload, {
      expiresIn: expiresIn || getJwtExpiresIn(),
    });
  }
}
