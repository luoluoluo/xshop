import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, ILike, Repository } from 'typeorm';
import { Product } from '@/entities/product.entity';
import { ProductPagination, ProductWhereInput } from './product.dto';
import { SorterInput } from '@/core/sorter.dto';

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
    sorters,
  }: {
    skip?: number;
    take?: number;
    where?: ProductWhereInput;
    sorters?: SorterInput[];
  }): Promise<ProductPagination> {
    const order: FindOptionsOrder<Product> = {};
    if (sorters?.length) {
      sorters.forEach((sorter) => {
        order[sorter.field] = sorter.direction;
      });
    } else {
      order.price = 'asc';
    }
    const [items, total] = await this.productRepository.findAndCount({
      where: {
        merchantId: where?.merchantId,
        isActive: true,
        title: where?.title ? ILike(`%${where?.title}%`) : undefined,
        id: where?.id,
      },
      skip,
      take,
      order,
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
