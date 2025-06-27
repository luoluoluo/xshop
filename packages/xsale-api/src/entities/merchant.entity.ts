import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Field, ObjectType, Float } from '@nestjs/graphql';
import { Base } from './base.entity';
import { Affiliate } from './affiliate.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { Client } from '@/decorators/client.decorator';

@ObjectType()
@Entity('merchant')
export class Merchant extends Base {
  @Field()
  @Column({ length: 100 })
  name: string;

  @Field()
  @Column({ length: 200 })
  description: string;

  @Field()
  @Column({ length: 100 })
  logo: string;

  @Field()
  @Column({ length: 100 })
  address: string;

  @Field()
  @Column({ length: 20 })
  phone: string;

  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, (product) => product.merchant)
  products: Product[];

  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, (order) => order.merchant)
  orders: Order[];

  @Client(['cms'])
  @Field(() => Boolean, { defaultValue: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Client(['cms', 'pms'])
  @Field(() => Float, { defaultValue: 0 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'affiliate_id', nullable: true })
  affiliateId: string;

  @Field(() => Affiliate, { nullable: true })
  @ManyToOne(() => Affiliate, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: Affiliate;
}
