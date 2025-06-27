import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ArticleCategory } from '@/entities/article-category.entity';
import { ArticleCategoryService } from './article-category.service';
import {
  ArticleCategoryPagination,
  ArticleCategoryWhereInput,
} from './article-category.dto';

@Resolver(() => ArticleCategory)
export class ArticleCategoryResolver {
  constructor(
    private readonly articleCategoryService: ArticleCategoryService,
  ) {}

  @Query(() => ArticleCategoryPagination)
  async articleCategories(
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => ArticleCategoryWhereInput, defaultValue: {} })
    where?: ArticleCategoryWhereInput,
  ): Promise<ArticleCategoryPagination> {
    return await this.articleCategoryService.findAll({
      skip,
      take,
      where,
    });
  }

  @Query(() => ArticleCategory)
  async articleCategory(@Args('id') id: string): Promise<ArticleCategory> {
    return await this.articleCategoryService.findOne(id);
  }
}
