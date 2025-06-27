import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from './product.entity';
import { Base } from './base.entity';

@ObjectType()
@Entity('product_attribute')
export class ProductAttribute extends Base {
  @Column({ name: 'product_id' })
  productId: string;

  @Field(() => Product)
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Field()
  @Column({ length: 50 })
  name: string;

  @Column('simple-array')
  @Field(() => [String])
  values: string[];
}
