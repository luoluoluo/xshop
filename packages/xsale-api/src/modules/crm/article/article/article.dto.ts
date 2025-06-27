import { ObjectType, InputType, Field, Int } from '@nestjs/graphql';
import { Article } from '@/entities/article.entity';

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
