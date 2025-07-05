import { Base } from './base.entity';
import { Entity, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Client } from '@/decorators/client.decorator';

@ObjectType()
@Entity('article')
export class Article extends Base {
  @Field({ nullable: true })
  @Column({ name: 'slug', unique: true })
  slug: string;

  @Field({ nullable: true })
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column()
  description: string;

  @Field({ nullable: true })
  @Column('text')
  content: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image?: string;

  @Client(['cms'])
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
