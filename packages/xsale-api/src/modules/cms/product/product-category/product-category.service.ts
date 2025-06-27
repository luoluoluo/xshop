import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '@/entities/product-category.entity';
import {
  ProductCategoryPagination,
  CreateProductCategoryInput,
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
      relations: {
        merchant: true,
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
      relations: {
        merchant: true,
      },
    });
    if (!category) {
      throw new NotFoundException(`分類ID ${id} 未找到`);
    }
    return category;
  }

  async create(
    createCategoryDto: CreateProductCategoryInput,
  ): Promise<ProductCategory> {
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
      console.log(err);
      if (err instanceof ConflictException) {
        throw err;
      }
      throw new InternalServerErrorException('創建分類失敗');
    }
  }

  async update(id: string, updateCategoryDto: any): Promise<ProductCategory> {
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
      if (err instanceof ConflictException) {
        throw err;
      }
      throw new InternalServerErrorException('更新分類失敗');
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`分類ID ${id} 未找到`);
    }
    return true;
  }
}
