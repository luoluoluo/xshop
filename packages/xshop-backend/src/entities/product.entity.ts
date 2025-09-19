import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Base } from './base.entity';
import { User } from './user.entity';

@ObjectType()
@Entity('product')
export class Product extends Base {
  @Field({ nullable: true })
  @Column({ name: 'slug', nullable: true })
  slug?: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field({ nullable: true })
  @Column({ length: 80 })
  title: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  content?: string;

  @Field(() => [String], { nullable: true })
  @Column({ type: 'json', nullable: true })
  images?: string[];

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

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', default: 0, nullable: true })
  stock: number;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'sort', default: 0 })
  sort?: number;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
