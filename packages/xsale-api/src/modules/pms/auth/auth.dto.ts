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
