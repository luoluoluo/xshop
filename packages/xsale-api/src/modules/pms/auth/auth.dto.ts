import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { Merchant } from '@/entities/merchant.entity';

@InputType()
export class LoginInput {
  @Field()
  phone: string;

  @Field()
  password: string;
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
  phone?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  businessScope?: string;

  @Field({ nullable: true })
  wechatQrcode?: string;
}
