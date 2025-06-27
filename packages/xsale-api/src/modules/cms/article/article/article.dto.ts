import { ObjectType, InputType, Field, Int } from '@nestjs/graphql';
import { Article } from '@/entities/article.entity';

@InputType()
export class CreateArticleInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  content: string;

  @Field()
  image: string;

  @Field()
  categoryId?: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => Int)
  sort: number;
}

@InputType()
export class UpdateArticleInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  image?: string;

  @Field()
  categoryId?: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Field(() => Int)
  sort: number;
}

@ObjectType()
export class ArticlePagination {
  @Field(() => [Article])
  data: Article[];

  @Field(() => Int)
  total: number;
}

@InputType()
export class ArticleWhereInput {
  @Field({ nullable: true })
  id?: string;
  @Field({ nullable: true })
  title?: string;
  @Field()
  categoryId?: string;
}
