import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ArticleCategory } from '@/entities/article-category.entity';
import { ArticleCategoryService } from './article-category.service';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import {
  CreateArticleCategoryInput,
  UpdateArticleCategoryInput,
  ArticleCategoryPagination,
  ArticleCategoryWhereInput,
} from './article-category.dto';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';

@Resolver(() => ArticleCategory)
export class ArticleCategoryResolver {
  constructor(
    private readonly articleCategoryService: ArticleCategoryService,
  ) {}

  @Query(() => ArticleCategoryPagination)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('article-category.list')
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
  @UseGuards(GqlAuthGuard)
  @RequirePermission('article-category.show')
  async articleCategory(@Args('id') id: string): Promise<ArticleCategory> {
    return await this.articleCategoryService.findOne(id);
  }

  @Mutation(() => ArticleCategory)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('article-category.create')
  async createArticleCategory(
    @Args('data') data: CreateArticleCategoryInput,
  ): Promise<ArticleCategory> {
    return await this.articleCategoryService.create(data);
  }

  @Mutation(() => ArticleCategory)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('article-category.edit')
  async updateArticleCategory(
    @Args('id') id: string,
    @Args('data') data: UpdateArticleCategoryInput,
  ): Promise<ArticleCategory> {
    return await this.articleCategoryService.update(id, data);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('article-category.delete')
  async deleteArticleCategory(@Args('id') id: string): Promise<boolean> {
    return await this.articleCategoryService.delete(id);
  }
}
