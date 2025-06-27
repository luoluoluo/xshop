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
      order: { sort: 'ASC' },
      where,
      relations: ['category'],
    });
    return { data, total };
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleRepository.findOneBy({ id });
    if (!article) {
      throw new Error('Article not found');
    }
    return article;
  }
}
