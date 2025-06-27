import { ObjectType, InputType, Field, Int } from '@nestjs/graphql';
import { ArticleCategory } from '@/entities/article-category.entity';

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
