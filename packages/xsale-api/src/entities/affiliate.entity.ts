import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Entity, Column } from 'typeorm';
import { Base } from './base.entity';
import { Client } from '@/decorators/client.decorator';

@ObjectType()
@Entity('affiliate')
export class Affiliate extends Base {
  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Client(['cms'])
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  @Column({ type: 'float', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Field({ nullable: true })
  @Column({ length: 100 })
  bankName?: string;

  @Field({ nullable: true })
  @Column({ length: 50 })
  bankAccount?: string;

  @Field({ nullable: true })
  @Column({ length: 50 })
  accountName?: string;

  @Column({ nullable: true })
  password?: string;
}
