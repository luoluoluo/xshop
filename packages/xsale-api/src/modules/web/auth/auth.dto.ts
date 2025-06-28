import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, Matches } from 'class-validator';
import { Customer } from '@/entities/customer.entity';

const phoneReg = /^1\d{10}$/;

export interface AuthPayload {
  sub: string;
  iat: number;
}

@InputType()
export class LoginInput {
  @Field({ nullable: true })
  @IsString({ message: '姓名不能为空' })
  name: string;

  @Field()
  @IsString({ message: '手机号不能为空' })
  @Matches(phoneReg, { message: '请输入有效的手机号' })
  phone: string;
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
}

@ObjectType()
export class AuthToken {
  @Field()
  token: string;

  @Field(() => Customer)
  customer: Customer;

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
