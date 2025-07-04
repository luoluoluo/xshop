import {
  Field,
  ObjectType,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';
import { Merchant } from '@/entities/merchant.entity';

export enum SmsCodeType {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
}

registerEnumType(SmsCodeType, {
  name: 'SmsCodeType',
  description: '短信验证码类型',
});

@InputType()
export class LoginInput {
  @Field()
  phone: string;

  @Field({ nullable: true })
  smsCode?: string;

  @Field({ nullable: true })
  password?: string;
}

@InputType()
export class RegisterInput {
  @Field()
  affiliateId: string;

  @Field()
  phone: string;

  @Field()
  smsCode: string;

  @Field()
  password: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  logo: string;

  @Field()
  address: string;

  @Field()
  businessScope: string;

  @Field()
  wechatQrcode: string;
}

@InputType()
export class SendSmsCodeInput {
  @Field()
  phone: string;

  @Field(() => SmsCodeType)
  type: SmsCodeType;
}

@ObjectType()
export class AuthToken {
  @Field()
  token: string;

  @Field(() => Merchant)
  merchant: Merchant;

  @Field()
  expiresIn: number;
}

@ObjectType()
export class AuthPayload {
  @Field()
  sub: string;

  @Field()
  iat: number;
}

@InputType()
export class UpdateMeInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  logo?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  businessScope?: string;

  @Field({ nullable: true })
  wechatQrcode?: string;

  @Field({ nullable: true })
  password?: string;
}
