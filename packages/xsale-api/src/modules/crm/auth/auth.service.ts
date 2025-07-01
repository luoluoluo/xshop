import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

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

  private getAuthToken(affiliate: Affiliate): AuthToken {
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
          throw new BadRequestException('该手机号已注册，请直接登录');
        }
      } else if (type === SmsCodeType.LOGIN) {
        // 登录验证码：检查账号是否存在
        if (!existingAffiliate) {
          throw new BadRequestException('账号不存在，请先注册');
        }
      }

      return await this.smsService.sendCode(phone);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('发送验证码失败');
    }
  }

  async login(loginInput: LoginInput): Promise<AuthToken> {
    // 验证验证码
    const isCodeValid = await this.smsService.verifyCode(
      loginInput.phone,
      loginInput.smsCode,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('验证码错误');
    }

    // 查找推广员
    const affiliate = await this.affiliateService.findByPhone(loginInput.phone);
    if (!affiliate) {
      throw new UnauthorizedException('账号不存在，请先注册');
    }

    return this.getAuthToken(affiliate);
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

    // 创建推广员
    const affiliate = await this.affiliateService.create({
      phone: registerInput.phone,
      name: registerInput.name,
    });

    return this.getAuthToken(affiliate);
  }
}
