import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Article } from '@/entities/article.entity';
import { ArticleService } from './article.service';
import {
  CreateArticleInput,
  UpdateArticleInput,
  ArticlePagination,
  ArticleWhereInput,
} from './article.dto';
import { RequirePermission } from '@/modules/_common/auth/decorators/require-permission.decorator';
import { UserAuthGuard } from '@/modules/_common/auth/guards/user-auth.guard';

@Resolver(() => Article)
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Query(() => ArticlePagination)
  @UseGuards(UserAuthGuard)
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
  @UseGuards(UserAuthGuard)
  @RequirePermission('article.show')
  async article(@Args('id') id: string): Promise<Article> {
    return await this.articleService.findOne(id);
  }

  @Mutation(() => Article)
  @UseGuards(UserAuthGuard)
  @RequirePermission('article.create')
  async createArticle(
    @Args('data') data: CreateArticleInput,
  ): Promise<Article> {
    return await this.articleService.create(data);
  }

  @Mutation(() => Article)
  @UseGuards(UserAuthGuard)
  @RequirePermission('article.edit')
  async updateArticle(
    @Args('id') id: string,
    @Args('data') data: UpdateArticleInput,
  ): Promise<Article> {
    return await this.articleService.update(id, data);
  }

  @Mutation(() => Boolean)
  @UseGuards(UserAuthGuard)
  @RequirePermission('article.delete')
  async deleteArticle(@Args('id') id: string): Promise<boolean> {
    return await this.articleService.delete(id);
  }
}
