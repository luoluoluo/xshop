import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { Affiliate } from './affiliate.entity';

@ObjectType()
@Entity('wechat_oauth')
export class WechatOAuth extends Base {
  @Field(() => String)
  @Column({ name: 'open_id' })
  openId?: string;

  @Field(() => String)
  @Column({ name: 'access_token' })
  accessToken?: string;

  @Field(() => Date)
  @Column({ name: 'expires_at' })
  expiresAt?: Date;

  @Field(() => String, { nullable: true })
  @Column({ name: 'refresh_token', nullable: true })
  refreshToken?: string;

  @Field(() => String)
  @Column({ name: 'affiliate_id' })
  affiliateId?: string;

  @Field(() => Affiliate)
  @OneToOne(() => Affiliate)
  @JoinColumn({ name: 'affiliate_id' })
  affiliate?: Affiliate;

  @Field(() => String, { nullable: true })
  @Column({ name: 'nick_name', nullable: true })
  nickName?: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'avatar', nullable: true })
  avatar?: string;
}
