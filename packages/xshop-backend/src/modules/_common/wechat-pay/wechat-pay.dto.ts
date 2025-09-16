import { Field, ObjectType } from '@nestjs/graphql';

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
