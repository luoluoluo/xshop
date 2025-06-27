import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MerchantService } from '../merchant/merchant.service';
import { AuthPayload, AuthToken } from './auth.dto';
import { Merchant } from '@/entities/merchant.entity';
import { getJwtExpiresIn } from '../../../core/auth.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly merchantService: MerchantService,
    private readonly jwtService: JwtService,
  ) {}

  async validateMerchant(payload: AuthPayload): Promise<Merchant> {
    const merchant = await this.merchantService.findOne(payload.sub);

    if (!merchant) {
      throw new UnauthorizedException('商户未找到');
    }
    return merchant;
  }

  async login(phone: string, password: string): Promise<AuthToken> {
    const merchant = await this.merchantService.validateMerchant(
      phone,
      password,
    );
    if (!merchant) {
      throw new UnauthorizedException('手机号或密码错误');
    }

    const iat = Math.floor(Date.now() / 1000);
    const expiresIn = getJwtExpiresIn();

    const payload: AuthPayload = {
      sub: merchant.id,
      iat,
    };

    return {
      token: this.jwtService.sign(payload, {
        expiresIn,
      }),
      merchant: { ...merchant, password: '' },
      expiresIn,
    };
  }
}
