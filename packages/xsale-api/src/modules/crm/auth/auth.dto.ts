import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString, MinLength, IsOptional, Matches } from 'class-validator';
import { Affiliate } from '@/entities/affiliate.entity';

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

  @Field()
  @IsString({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度至少为6位' })
  password: string;
}

@InputType()
export class UpdateMeInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: '姓名不能为空' })
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(phoneReg, { message: '请输入有效的手机号' })
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: '密码长度至少为6位' })
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

@ObjectType()
export class WechatAccessToken {
  @Field()
  accessToken: string;

  @Field()
  openId: string;

  @Field()
  expiresIn: number;
}
