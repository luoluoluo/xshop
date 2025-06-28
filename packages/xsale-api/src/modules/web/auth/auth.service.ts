import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomerService } from '../customer/customer.service';
import { SmsService } from '../../_common/sms/sms.service';
import { AuthPayload, AuthToken, LoginInput } from './auth.dto';
import { Customer } from '@/entities/customer.entity';
import { getJwtExpiresIn } from '../../../core/auth.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
  ) {}

  async validateCustomer(payload: AuthPayload): Promise<Customer> {
    const customer = await this.customerService.findOne(payload.sub);
    if (!customer) {
      throw new UnauthorizedException('用戶未找到');
    }
    return customer;
  }

  getAuthToken(customer: Customer): AuthToken {
    const iat = Math.floor(Date.now() / 1000);
    const expiresIn = getJwtExpiresIn();
    const payload: AuthPayload = {
      sub: customer.id,
      iat,
    };
    return {
      token: this.jwtService.sign(payload, {
        expiresIn,
      }),
      customer,
      expiresIn,
    };
  }

  async login(data: LoginInput): Promise<AuthToken> {
    let customer = await this.customerService.findByPhone(data.phone);
    if (!customer) {
      // 如果用户不存在，则创建一个新用户
      customer = await this.customerService.create({
        phone: data.phone,
        name: data.name,
      });
    }
    return this.getAuthToken(customer);
  }
}
