import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Product } from '@/entities/product.entity';
import {
  ProductOrderByInput,
  ProductPagination,
  ProductWhereInput,
} from './product.dto';

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
    orderBy,
  }: {
    skip?: number;
    take?: number;
    where?: ProductWhereInput;
    orderBy?: ProductOrderByInput;
  }): Promise<ProductPagination> {
    const [items, total] = await this.productRepository.findAndCount({
      where: {
        merchantId: where?.merchantId,
        isActive: true,
        title: where?.title ? ILike(`%${where?.title}%`) : undefined,
        id: where?.id,
      },
      skip,
      take,
      order: orderBy || {
        price: 'ASC',
      },
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, merchant: { isActive: true } },
    });
    if (!product) {
      throw new NotFoundException(`產品ID ${id} 未找到`);
    }
    return product;
  }
}
