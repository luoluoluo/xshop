import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import {
  Field,
  ObjectType,
  Float,
  registerEnumType,
  Int,
} from '@nestjs/graphql';
import { Base } from './base.entity';
import { Product } from './product.entity';
import { Merchant } from './merchant.entity';
import { Affiliate } from './affiliate.entity';
import { Customer } from './customer.entity';

export enum OrderStatus {
  CREATED = 'created',
  PAID = 'paid',
  COMPLETED = 'completed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

@ObjectType()
@Entity('order')
export class Order extends Base {
  @Field({ nullable: true })
  @Column({ name: 'product_id' })
  productId: string;

  @Field(() => [Product], { nullable: true })
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Field(() => String, { nullable: true })
  @Column({ name: 'merchant_id', nullable: true })
  merchantId: string;

  @Field(() => Merchant, { nullable: true })
  @ManyToOne(() => Merchant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @Field(() => String, { nullable: true })
  @Column({ name: 'affiliate_id', nullable: true })
  affiliateId: string;

  @Field(() => Affiliate, { nullable: true })
  @ManyToOne(() => Affiliate, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: Affiliate;

  @Field(() => String, { nullable: true })
  @Column({ name: 'merchant_affiliate_id', nullable: true })
  merchantAffiliateId: string;

  // 招商经理
  @Field(() => Affiliate, { nullable: true })
  @ManyToOne(() => Affiliate, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'merchant_affiliate_id' })
  merchantAffiliate: Affiliate;

  @Field(() => Customer, { nullable: true })
  @ManyToOne(() => Customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', name: 'quantity' })
  quantity: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', precision: 10, scale: 2, name: 'amount' })
  amount: number;

  @Field(() => Float, { nullable: true })
  @Column({
    type: 'float',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'affiliate_amount',
  })
  affiliateAmount?: number;

  // 招商经理佣金
  @Field(() => Float, { nullable: true })
  @Column({
    type: 'float',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'merchant_affiliate_amount',
  })
  merchantAffiliateAmount?: number;

  @Field(() => Float, { nullable: true })
  @Column({
    type: 'float',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'platform_amount',
  })
  platformAmount?: number;

  @Field(() => Float, { nullable: true })
  @Column({
    type: 'float',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'merchant_amount',
  })
  merchantAmount?: number;

  @Field(() => OrderStatus, { nullable: true })
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.CREATED,
    name: 'status',
  })
  status: OrderStatus;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'receiver_name' })
  receiverName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'receiver_phone' })
  receiverPhone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'note' })
  note?: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'datetime', nullable: true, name: 'paid_at' })
  paidAt?: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'datetime', nullable: true, name: 'refunded_at' })
  refundedAt?: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'datetime', nullable: true, name: 'completed_at' })
  completedAt?: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'datetime', nullable: true, name: 'cancelled_at' })
  cancelledAt?: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, name: 'product_title' })
  productTitle?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, name: 'product_image' })
  productImage?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, name: 'product_content', type: 'text' })
  productContent?: string;

  @Field(() => Float, { nullable: true })
  @Column({
    type: 'float',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'product_price',
  })
  productPrice?: number;
}
