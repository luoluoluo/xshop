import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { Merchant } from '@/entities/merchant.entity';
import { SmsCodeType } from '@/types/sms-code-type';

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

  @Field(() => [String], { nullable: true })
  images?: string[];
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

@InputType()
export class ApplyWechatMerchantInput {
  @Field()
  idCardFrontPhoto: string;

  @Field()
  idCardBackPhoto: string;

  @Field()
  businessLicensePhoto: string;

  @Field()
  bankCardPhoto: string;
}
