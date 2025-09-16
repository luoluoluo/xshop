import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '@/entities/article.entity';
import { ArticlePagination, ArticleWhereInput } from './article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async findAll({
    skip,
    take,
    where,
  }: {
    skip?: number;
    take?: number;
    where?: ArticleWhereInput;
  }): Promise<ArticlePagination> {
    const [data, total] = await this.articleRepository.findAndCount({
      skip,
      take,
      order: { id: 'DESC' },
      where,
    });
    return { data, total };
  }

  async findOneBySlug(slug: string): Promise<Article> {
    const article = await this.articleRepository.findOneBy({ slug });
    if (!article) {
      throw new Error('Article not found');
    }
    return article;
  }
}
