import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { Client } from '@/decorators/client.decorator';
import { WechatOAuth } from './wechat-oauth.entity';
import { MerchantAffiliate } from './merchant-affiliate.entity';

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

  @Column({ nullable: true })
  password?: string;

  @Field(() => WechatOAuth, { nullable: true })
  @OneToOne(() => WechatOAuth, (wechatOAuth) => wechatOAuth.affiliate)
  wechatOAuth?: WechatOAuth;

  @Field(() => [MerchantAffiliate], { nullable: true })
  @OneToMany(
    () => MerchantAffiliate,
    (merchantAffiliate) => merchantAffiliate.affiliate,
  )
  merchantAffiliates?: MerchantAffiliate[];
}
