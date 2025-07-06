import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Entity, Column, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { Client } from '@/decorators/client.decorator';
import { WechatOAuth } from './wechat-oauth.entity';

@ObjectType()
@Entity('affiliate')
export class Affiliate extends Base {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Client(['cms'])
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  @Column({ type: 'float', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  bankName?: string;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  bankAccount?: string;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  accountName?: string;

  @Column({ nullable: true })
  password?: string;

  @Field(() => WechatOAuth, { nullable: true })
  @OneToOne(() => WechatOAuth, (wechatOAuth) => wechatOAuth.affiliate)
  wechatOAuth?: WechatOAuth;
}
