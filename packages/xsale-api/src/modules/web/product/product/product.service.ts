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
  }: {
    skip?: number;
    take?: number;
    where?: ProductWhereInput;
  }): Promise<ProductPagination> {
    const [items, total] = await this.productRepository.findAndCount({
      where,
      skip,
      take,
      relations: ['category', 'attributes'],
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
