import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Affiliate } from './affiliate.entity';
import { Merchant } from './merchant.entity';

@ObjectType()
@Entity('merchant_affiliate')
export class MerchantAffiliate {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ name: 'merchant_id' })
  merchantId: string;

  @Field()
  @Column({ name: 'affiliate_id' })
  affiliateId: string;

  @Field(() => Affiliate)
  @ManyToOne(() => Affiliate, (affiliate) => affiliate.merchantAffiliates)
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: Affiliate;

  @Field(() => Merchant)
  @ManyToOne(() => Merchant, (merchant) => merchant.merchantAffiliates)
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;
}
