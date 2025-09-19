import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, ILike, Repository } from 'typeorm';
import { Product } from '@/entities/product.entity';
import { ProductPagination, ProductWhereInput } from './product.dto';
import { SorterInput } from '@/types/sorter';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

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
      order.sort = 'asc';
    }
    const [items, total] = await this.productRepository.findAndCount({
      where: {
        userId: where?.userId,
        title: where?.title ? ILike(`%${where?.title}%`) : undefined,
        id: where?.id,
      },
      skip,
      take,
      order,
      relations: ['product'],
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: [{ id }, { slug: id }],
      relations: ['product'],
    });
    if (!product) {
      throw new NotFoundException(`產品ID ${id} 未找到`);
    }
    return product;
  }
}
