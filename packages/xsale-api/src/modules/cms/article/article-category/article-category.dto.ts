import { ObjectType, InputType, Field, Int } from '@nestjs/graphql';
import { ArticleCategory } from '@/entities/article-category.entity';

@InputType()
export class CreateArticleCategoryInput {
  @Field({ nullable: true })
  parentId?: string;

  @Field()
  name: string;

  @Field(() => Int)
  sort: number;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

@InputType()
export class UpdateArticleCategoryInput {
  @Field({ nullable: true })
  parentId?: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  sort?: number;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

@InputType()
export class ArticleCategoryWhereInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  parentId?: string;
}

@ObjectType()
export class ArticleCategoryPagination {
  @Field(() => [ArticleCategory])
  data: ArticleCategory[];

  @Field(() => Int)
  total: number;
}
