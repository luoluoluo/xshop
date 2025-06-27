import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreatePaymentInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  openId: string;
}

@ObjectType()
export class Payment {
  @Field()
  appId: string;

  @Field()
  timeStamp: string;

  @Field()
  nonceStr: string;

  @Field()
  package: string;

  @Field()
  signType: string;

  @Field()
  paySign: string;
}
