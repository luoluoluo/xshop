import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, Matches } from 'class-validator';
import { User } from '@/entities/user.entity';
import { SmsCodeType } from '@/types/sms-code-type';

const phoneReg = /^1\d{10}$/;

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
export class WechatLoginInput {
  @Field({ nullable: true })
  @IsOptional()
  code?: string;

  @Field({ nullable: true })
  @IsOptional()
  state?: string;
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

@ObjectType()
export class AuthToken {
  @Field()
  token: string;

  @Field(() => User)
  user: User;

  @Field()
  expiresIn: number;
}

export interface UpdateWechatOAuthInput {
  openId: string;
  accessToken: string;
  expiresIn: number;
  nickName?: string;
  avatar?: string;
  refreshToken: string;
}
