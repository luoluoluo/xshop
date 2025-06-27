import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from './base.entity';
import { Merchant } from './merchant.entity';
import { Client } from '@/decorators/client.decorator';

@ObjectType()
@Entity('product_category')
export class ProductCategory extends Base {
  @Field(() => String, { nullable: true })
  @Column({ name: 'merchant_id', nullable: true })
  merchantId: string;

  @Field(() => Merchant, { nullable: true })
  @ManyToOne(() => Merchant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @Field({ nullable: true })
  @Column({ length: 80, unique: true })
  name: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  image?: string;

  @Field({ nullable: true })
  @Column({ type: 'int', default: 0 })
  sort: number;

  @Client(['cms', 'pms'])
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
