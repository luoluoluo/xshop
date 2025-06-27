import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AffiliateService } from '../affiliate/affiliate.service';
import { SmsService } from '../../_common/sms/sms.service';
import { AuthPayload, AuthToken, LoginInput } from './auth.dto';
import { Affiliate } from '@/entities/affiliate.entity';
import { getJwtExpiresIn } from '../../../core/auth.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly affiliateService: AffiliateService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
  ) {}

  async validateAffiliate(payload: AuthPayload): Promise<Affiliate> {
    const affiliate = await this.affiliateService.findOne(payload.sub);
    if (!affiliate) {
      throw new UnauthorizedException('用戶未找到');
    }
    return affiliate;
  }

  getAuthToken(affiliate: Affiliate): AuthToken {
    const iat = Math.floor(Date.now() / 1000);
    const expiresIn = getJwtExpiresIn();
    const payload: AuthPayload = {
      sub: affiliate.id,
      iat,
    };
    return {
      token: this.jwtService.sign(payload, {
        expiresIn,
      }),
      affiliate: { ...affiliate, password: '' },
      expiresIn,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthToken> {
    const affiliate = await this.affiliateService.findByPhone(loginInput.phone);
    if (!affiliate) {
      throw new UnauthorizedException('用戶不存在或密碼錯誤');
    }

    // 验证密码
    const isPasswordValid = await this.affiliateService.validateAffiliate(
      affiliate.phone!,
      loginInput.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('用戶不存在或密碼錯誤');
    }

    return this.getAuthToken(affiliate);
  }
}
