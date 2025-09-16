import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '@/entities/article.entity';
import { ArticleService } from './article/article.service';
import { ArticleResolver } from './article/article.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [ArticleService, ArticleResolver],
  exports: [ArticleService, ArticleResolver],
})
export class ArticleModule {}
