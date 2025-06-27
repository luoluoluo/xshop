import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from './base.entity';
import { Client } from '@/decorators/client.decorator';

@ObjectType()
@Entity('article_category')
export class ArticleCategory extends Base {
  @Field({ nullable: true })
  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @Field(() => ArticleCategory, { nullable: true })
  @ManyToOne(() => ArticleCategory)
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  parent?: ArticleCategory;

  @Field()
  @Column({ length: 80, unique: true })
  name: string;

  @Field()
  @Column({ type: 'int', default: 0 })
  sort: number;

  @Client(['cms'])
  @Field(() => Boolean, { defaultValue: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
