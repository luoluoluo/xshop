import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleCategory } from '@/entities/article-category.entity';
import {
  ArticleCategoryPagination,
  ArticleCategoryWhereInput,
  CreateArticleCategoryInput,
} from './article-category.dto';

@Injectable()
export class ArticleCategoryService {
  private readonly logger = new Logger(ArticleCategoryService.name);

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

  async create(
    createCategoryDto: CreateArticleCategoryInput,
  ): Promise<ArticleCategory> {
    try {
      // 檢查名稱是否已存在
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: createCategoryDto.name },
      });
      if (existingCategory) {
        throw new ConflictException(
          `分類名稱 ${createCategoryDto.name} 已存在`,
        );
      }

      const category = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(category);
      return category;
    } catch (err) {
      this.logger.error('創建文章分類失敗', {
        error: err,
        createDto: createCategoryDto,
      });
      if (err instanceof ConflictException) {
        throw err;
      }
      throw new InternalServerErrorException('創建分類失敗');
    }
  }

  async update(id: string, updateCategoryDto: any): Promise<ArticleCategory> {
    const category = await this.findOne(id);

    try {
      // 如果要更新名稱，檢查是否與其他分類重複
      if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
        const existingCategory = await this.categoryRepository.findOne({
          where: { name: updateCategoryDto.name },
        });
        if (existingCategory) {
          throw new ConflictException(
            `分類名稱 ${updateCategoryDto.name} 已存在`,
          );
        }
      }

      Object.assign(category, updateCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (err) {
      this.logger.error('更新文章分類失敗', {
        error: err,
        categoryId: id,
        updateDto: updateCategoryDto,
      });
      if (err instanceof ConflictException) {
        throw err;
      }
      throw new InternalServerErrorException('更新分類失敗');
    }
  }

  async delete(id: string): Promise<boolean> {
    // 檢查是否有子分類
    const hasChildren = await this.categoryRepository.findOne({
      where: { parentId: id },
    });
    if (hasChildren) {
      throw new ConflictException('無法刪除含有子分類的分類');
    }

    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`分類ID ${id} 未找到`);
    }
    return true;
  }
}
