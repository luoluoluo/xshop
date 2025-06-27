import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleCategory } from '@/entities/article-category.entity';
import {
  ArticleCategoryPagination,
  ArticleCategoryWhereInput,
} from './article-category.dto';

@Injectable()
export class ArticleCategoryService {
  constructor(
    @InjectRepository(ArticleCategory)
    private readonly categoryRepository: Repository<ArticleCategory>,
  ) {}

  async findAll({
    skip,
    take,
    where = {},
  }: {
    skip?: number;
    take?: number;
    where?: ArticleCategoryWhereInput;
  }): Promise<ArticleCategoryPagination> {
    const [items, total] = await this.categoryRepository.findAndCount({
      where,
      skip,
      take,
      order: {
        sort: 'ASC',
      },
      relations: ['parent'],
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(id: string): Promise<ArticleCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`分類ID ${id} 未找到`);
    }
    return category;
  }
}
