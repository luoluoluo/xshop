import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from './base.entity';
import { Merchant } from './merchant.entity';
import { Client } from '@/decorators/client.decorator';

@ObjectType()
@Entity('banner')
export class Banner extends Base {
  @Field(() => String, { nullable: true })
  @Column({ name: 'merchant_id', nullable: true })
  merchantId: string;

  @Field(() => Merchant, { nullable: true })
  @ManyToOne(() => Merchant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  image: string;

  @Field(() => Number)
  @Column({ default: 0 })
  sort: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  link: string;

  @Client(['cms', 'pms'])
  @Field(() => Boolean, { defaultValue: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
