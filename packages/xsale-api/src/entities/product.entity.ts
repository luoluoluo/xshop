import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Base } from './base.entity';
import { Merchant } from './merchant.entity';
import { Client } from '@/decorators/client.decorator';

@ObjectType()
@Entity('product')
export class Product extends Base {
  @Field(() => String, { nullable: true })
  @Column({ name: 'merchant_id', nullable: true })
  merchantId: string;

  @Field(() => Merchant, { nullable: true })
  @ManyToOne(() => Merchant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @Field({ nullable: true })
  @Column({ length: 80 })
  title: string;

  @Field({ nullable: true })
  @Column({ type: 'text' })
  content: string;

  @Field({ nullable: true })
  @Column({ length: 100 })
  image: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', precision: 10, scale: 2 })
  price: number;

  @Field(() => Float, { nullable: true })
  @Column({
    name: 'commission',
    type: 'float',
    precision: 10,
    scale: 2,
  })
  commission: number;

  @Field(() => Float, { nullable: true })
  platformCommission?: number;

  @Field(() => Float, { nullable: true })
  merchantAffiliateCommission?: number;

  @Field(() => Float, { nullable: true })
  affiliateCommission?: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', default: 0, nullable: true })
  stock: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', default: 0, name: 'sort' })
  sort: number;

  @Client(['cms', 'pms'])
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
