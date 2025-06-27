import { Base } from './base.entity';
import { Entity, ManyToOne, Column, JoinColumn } from 'typeorm';
import { ArticleCategory } from './article-category.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Client } from '@/decorators/client.decorator';

@ObjectType()
@Entity('article')
export class Article extends Base {
  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column('text')
  content: string;

  @Field()
  @Column({ nullable: true })
  image?: string;

  @Field()
  @Column({ type: 'int', default: 0 })
  sort: number;

  @Field(() => String, { nullable: true })
  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @Field(() => ArticleCategory, { nullable: true })
  @ManyToOne(() => ArticleCategory)
  @JoinColumn({ name: 'category_id' })
  category: ArticleCategory;

  @Client(['cms'])
  @Field(() => Boolean, { defaultValue: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
