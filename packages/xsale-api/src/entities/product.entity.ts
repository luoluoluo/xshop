import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { ProductCategory } from './product-category.entity';
import { Base } from './base.entity';
import { ProductAttribute } from './product-attribute.entity';
import { Merchant } from './merchant.entity';
import { Client } from '@/decorators/client.decorator';

@ObjectType()
@Entity('product')
export class Product extends Base {
  @Field(() => String, {
    nullable: true,
  })
  @Column({ name: 'category_id', nullable: true })
  categoryId?: string;

  @Field(() => ProductCategory, { nullable: true })
  @ManyToOne(() => ProductCategory)
  @JoinColumn({ name: 'category_id' })
  category?: ProductCategory;

  @Field(() => String, { nullable: true })
  @Column({ name: 'merchant_id', nullable: true })
  merchantId: string;

  @Field(() => Merchant, { nullable: true })
  @ManyToOne(() => Merchant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @Field()
  @Column({ length: 80 })
  title: string;

  @Field()
  @Column({ type: 'text' })
  content: string;

  @Field()
  @Column({ length: 100 })
  image: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Field(() => Float)
  @Column({
    name: 'commission',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  commission: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0, nullable: true })
  stock: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0, name: 'sort' })
  sort: number;

  @Client(['cms', 'pms'])
  @Field(() => Boolean, { defaultValue: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Field(() => [ProductAttribute], { nullable: true })
  @OneToMany(() => ProductAttribute, (attribute) => attribute.product)
  attributes: ProductAttribute[];
}
