import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '@/entities/product-category.entity';
import {
  ProductCategoryPagination,
  ProductCategoryWhereInput,
} from './product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
  ) {}

  async findAll({
    skip,
    take,
    where = {},
  }: {
    skip?: number;
    take?: number;
    where?: ProductCategoryWhereInput;
  }): Promise<ProductCategoryPagination> {
    const [items, total] = await this.categoryRepository.findAndCount({
      where,
      skip,
      take,
      order: {
        sort: 'ASC',
      },
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(id: string): Promise<ProductCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`分類ID ${id} 未找到`);
    }
    return category;
  }
}
