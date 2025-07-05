import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@/entities/product.entity';
import { ProductPagination, ProductWhereInput } from './product.dto';
import {
  MERCHANT_AFFILIATE_COMMISSION_PERCENTAGE,
  PLATFORM_FEE_PERCENTAGE,
} from '@/core/constants';

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
  }: {
    skip?: number;
    take?: number;
    where?: ProductWhereInput;
  }): Promise<ProductPagination> {
    const [items, total] = await this.productRepository.findAndCount({
      where: {
        ...where,
        isActive: true,
        merchant: {
          isActive: true,
        },
      },
      skip,
      take,
      relations: {
        merchant: {
          affiliate: true,
        },
      },
      order: { id: 'DESC' },
    });

    // 计算佣金
    items.forEach((item) => {
      // 平台佣金
      item.platformCommission =
        Math.floor(item.price * PLATFORM_FEE_PERCENTAGE * 100) / 100;
      // 招商经理佣金
      item.merchantAffiliateCommission =
        Math.floor(
          item.price * MERCHANT_AFFILIATE_COMMISSION_PERCENTAGE * 100,
        ) / 100;
      // 推广者佣金
      item.affiliateCommission =
        item.commission -
        item.platformCommission -
        item.merchantAffiliateCommission;
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
