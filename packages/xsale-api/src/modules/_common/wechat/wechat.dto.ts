import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@ObjectType()
export class WechatJsConfig {
  @Field()
  appId: string;

  @Field()
  nonceStr: string;

  @Field()
  signature: string;

  @Field()
  timestamp: number;
}

@InputType()
export class WechatJsConfigWhere {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  url?: string;
}
