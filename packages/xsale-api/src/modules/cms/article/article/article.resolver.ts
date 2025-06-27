import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Article } from '@/entities/article.entity';
import { ArticleService } from './article.service';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import {
  CreateArticleInput,
  UpdateArticleInput,
  ArticlePagination,
  ArticleWhereInput,
} from './article.dto';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';

@Resolver(() => Article)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Query(() => ArticlePagination)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('article.list')
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
  @UseGuards(GqlAuthGuard)
  @RequirePermission('article.show')
  async article(@Args('id') id: string): Promise<Article> {
    return await this.articleService.findOne(id);
  }

  @Mutation(() => Article)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('article.create')
  async createArticle(
    @Args('data') data: CreateArticleInput,
  ): Promise<Article> {
    return await this.articleService.create(data);
  }

  @Mutation(() => Article)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('article.edit')
  async updateArticle(
    @Args('id') id: string,
    @Args('data') data: UpdateArticleInput,
  ): Promise<Article> {
    return await this.articleService.update(id, data);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('article.delete')
  async deleteArticle(@Args('id') id: string): Promise<boolean> {
    return await this.articleService.delete(id);
  }
}
