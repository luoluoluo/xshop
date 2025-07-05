import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Article } from '@/entities/article.entity';
import { ArticleService } from './article.service';
import { ArticlePagination, ArticleWhereInput } from './article.dto';

@Resolver(() => Article)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Query(() => ArticlePagination)
  async articles(
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    where?: ArticleWhereInput,
  ): Promise<ArticlePagination> {
    return await this.articleService.findAll({
      skip,
      take,
      where,
    });
  }

  @Query(() => Article)
  async article(@Args('slug') slug: string): Promise<Article> {
    return await this.articleService.findOneBySlug(slug);
  }
}
