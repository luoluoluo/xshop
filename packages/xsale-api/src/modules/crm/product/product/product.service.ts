import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@/entities/product.entity';
import { ProductPagination, ProductWhereInput } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll({
    skip,
    take,
    where,
    affiliateId,
  }: {
    skip?: number;
    take?: number;
    where?: ProductWhereInput;
    affiliateId?: string;
  }): Promise<ProductPagination> {
    // 构建查询条件
    const whereCondition: any = {
      ...where,
      isActive: true,
      merchant: {
        isActive: true,
      },
    };

    // 如果指定了推广者ID，添加关联条件
    if (affiliateId) {
      whereCondition.merchant = {
        ...whereCondition.merchant,
        merchantAffiliates: {
          affiliate: {
            id: affiliateId,
          },
        },
      };
    }

    const [items, total] = await this.productRepository.findAndCount({
      where: whereCondition,
      skip,
      take,
      relations: {
        merchant: {
          affiliate: true,
          merchantAffiliates: {
            affiliate: true,
          },
        },
      },
      order: { id: 'DESC' },
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'attributes'],
    });
    if (!product) {
      throw new NotFoundException(`產品ID ${id} 未找到`);
    }
    return product;
  }
}
