import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '@/entities/article.entity';
import { ArticleService } from './article/article.service';
import { ArticleResolver } from './article/article.resolver';
import { AuthModule } from '@/modules/_common/auth/auth.module';
@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Article])],
  providers: [ArticleService, ArticleResolver],
  exports: [ArticleService, ArticleResolver],
})
export class ArticleModule {}
