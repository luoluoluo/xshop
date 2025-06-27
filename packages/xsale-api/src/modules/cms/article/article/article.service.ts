import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '@/entities/article.entity';
import {
  CreateArticleInput,
  ArticlePagination,
  UpdateArticleInput,
  ArticleWhereInput,
} from './article.dto';

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

  async create(data: CreateArticleInput): Promise<Article> {
    const article = this.articleRepository.create(data);
    return await this.articleRepository.save(article);
  }

  async update(id: string, data: UpdateArticleInput): Promise<Article> {
    const article = await this.findOne(id);
    Object.assign(article, data);
    return await this.articleRepository.save(article);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.articleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Article ${id} not found`);
    }
    return true;
  }
}
