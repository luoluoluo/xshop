import {
  Field,
  ObjectType,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsString, IsOptional, Matches } from 'class-validator';
import { Affiliate } from '@/entities/affiliate.entity';

const phoneReg = /^1\d{10}$/;

export enum SmsCodeType {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
}

registerEnumType(SmsCodeType, {
  name: 'SmsCodeType',
  description: '短信验证码类型',
});

export interface AuthPayload {
  sub: string;
  iat: number;
}

@InputType()
export class LoginInput {
  @Field()
  @IsString({ message: '手机号不能为空' })
  @Matches(phoneReg, { message: '请输入有效的手机号' })
  phone: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: '验证码不能为空' })
  smsCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: '密码不能为空' })
  password?: string;
}

@InputType()
export class RegisterInput {
  @Field()
  @IsString({ message: '手机号不能为空' })
  @Matches(phoneReg, { message: '请输入有效的手机号' })
  phone: string;

  @Field()
  @IsString({ message: '验证码不能为空' })
  smsCode: string;

  @Field()
  @IsString({ message: '姓名不能为空' })
  name: string;

  @Field()
  @IsString({ message: '密码不能为空' })
  password: string;
}

@InputType()
export class SendSmsCodeInput {
  @Field()
  @IsString({ message: '手机号不能为空' })
  @Matches(phoneReg, { message: '请输入有效的手机号' })
  phone: string;

  @Field(() => SmsCodeType)
  type: SmsCodeType;
}

@InputType()
export class UpdateMeInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: '姓名不能为空' })
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: '密码不能为空' })
  password?: string;
}

@ObjectType()
export class AuthToken {
  @Field()
  token: string;

  @Field(() => Affiliate)
  affiliate: Affiliate;

  @Field()
  expiresIn: number;
}
