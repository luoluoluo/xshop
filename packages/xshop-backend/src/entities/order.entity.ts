import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ObjectType, Float, Int } from '@nestjs/graphql';
import { Base } from './base.entity';
import { Product } from './product.entity';
import { OrderStatus } from '@/types/order-status';
import { User } from './user.entity';

@ObjectType()
@Entity('order')
export class Order extends Base {
  @Field({ nullable: true })
  @Column({ name: 'product_id' })
  productId: string;

  @Field(() => Product, { nullable: true })
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Field(() => String, { nullable: true })
  @Column({ name: 'merchant_id', nullable: true })
  merchantId: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'merchant_id' })
  merchant: User;

  @Field(() => String, { nullable: true })
  @Column({ name: 'affiliate_id', nullable: true })
  affiliateId: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: User;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'customer_id' })
  customer: User;

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
  @Column({ nullable: true, name: 'product_description', type: 'text' })
  productDescription?: string;

  @Field(() => Float, { nullable: true })
  @Column({
    type: 'float',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'product_price',
  })
  productPrice?: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, name: 'wechat_transaction_id' })
  wechatTransactionId?: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'wechat_merchant_id', nullable: true })
  wechatMerchantId?: string;
}
