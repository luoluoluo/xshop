import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '@/entities/article.entity';
import { ArticleCategory } from '@/entities/article-category.entity';
import { ArticleService } from './article/article.service';
import { ArticleResolver } from './article/article.resolver';
import { ArticleCategoryService } from './article-category/article-category.service';
import { ArticleCategoryResolver } from './article-category/article-category.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Article, ArticleCategory])],
  providers: [
    ArticleService,
    ArticleResolver,
    ArticleCategoryService,
    ArticleCategoryResolver,
  ],
  exports: [
    ArticleService,
    ArticleResolver,
    ArticleCategoryService,
    ArticleCategoryResolver,
  ],
})
export class ArticleModule {}
