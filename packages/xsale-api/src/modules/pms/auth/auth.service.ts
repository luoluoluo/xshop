import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MerchantService } from '../merchant/merchant.service';
import { SmsService } from '../../_common/sms/sms.service';
import {
  AuthPayload,
  AuthToken,
  LoginInput,
  RegisterInput,
  SendSmsCodeInput,
  SmsCodeType,
} from './auth.dto';
import { Merchant } from '@/entities/merchant.entity';
import { getJwtExpiresIn } from '../../../core/auth.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly merchantService: MerchantService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
  ) {}

  async validateMerchant(payload: AuthPayload): Promise<Merchant> {
    const merchant = await this.merchantService.findOne(payload.sub);

    if (!merchant) {
      throw new UnauthorizedException('商户未找到');
    }
    return merchant;
  }

  private getAuthToken(merchant: Merchant): AuthToken {
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
      merchant,
      expiresIn,
    };
  }

  async sendSmsCode(sendSmsCodeInput: SendSmsCodeInput): Promise<boolean> {
    const { phone, type } = sendSmsCodeInput;

    try {
      // 根据验证码类型进行不同的业务校验
      const existingMerchant = await this.merchantService.findByPhone(phone);

      if (type === SmsCodeType.REGISTER) {
        // 注册验证码：检查手机号是否已注册
        if (existingMerchant) {
          throw new BadRequestException('该手机号已注册，请直接登录');
        }
      } else if (type === SmsCodeType.LOGIN) {
        // 登录验证码：检查账号是否存在
        if (!existingMerchant) {
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

    // 查找商户
    const merchant = await this.merchantService.findByPhone(loginInput.phone);
    if (!merchant) {
      throw new UnauthorizedException('商户不存在，请先注册');
    }

    return this.getAuthToken(merchant);
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

    // 创建商户
    const merchant = await this.merchantService.create({
      phone: registerInput.phone,
      name: registerInput.name,
      description: registerInput.description,
      logo: registerInput.logo,
      address: registerInput.address,
      businessScope: registerInput.businessScope,
      wechatQrcode: registerInput.wechatQrcode,
      affiliateId: registerInput.affiliateId,
    });

    return this.getAuthToken(merchant);
  }
}
