import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Base } from './base.entity';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Article } from './article.entity';

@ObjectType()
@Entity('view')
@Index(['userId', 'createdAt'])
@Index(['productId', 'createdAt'])
@Index(['articleId', 'createdAt'])
@Index(['ipAddress', 'createdAt'])
export class View extends Base {
  @Field(() => String, { nullable: true })
  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Field(() => String, { nullable: true })
  @Column({ name: 'product_id', nullable: true })
  productId?: string;

  @Field(() => Product, { nullable: true })
  @ManyToOne(() => Product, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product?: Product;

  @Field(() => String, { nullable: true })
  @Column({ name: 'article_id', nullable: true })
  articleId?: string;

  @Field(() => Article, { nullable: true })
  @ManyToOne(() => Article, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'article_id' })
  article?: Article;

  @Field(() => String, { nullable: true })
  @Column({ name: 'creator_id', nullable: true })
  creatorId?: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'creator_id' })
  creator?: User;

  @Field({ nullable: true })
  @Column({ name: 'ip_address', nullable: true })
  ipAddress?: string;

  @Field({ nullable: true })
  @Column({ name: 'user_agent', nullable: true, type: 'text' })
  userAgent?: string;

  @Field({ nullable: true })
  @Column({ name: 'referer', nullable: true, type: 'text' })
  referer?: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'page_type', nullable: true })
  pageType?: string; // 'product', 'article', 'user', etc.

  @Field({ nullable: true })
  @Column({ name: 'page_url', nullable: true, type: 'text' })
  pageUrl?: string;
}
