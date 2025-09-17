import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, ILike, Repository } from 'typeorm';
import { Product } from '@/entities/product.entity';
import {
  CreateProductInput,
  ProductPagination,
  ProductWhereInput,
  UpdateProductInput,
} from './product.dto';
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
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`產品ID ${id} 未找到`);
    }
    return product;
  }
  async create(
    createProductDto: CreateProductInput & { userId?: string },
  ): Promise<Product> {
    try {
      // 创建产品
      const product = this.productRepository.create({
        ...createProductDto,
      });
      return this.productRepository.save(product);
    } catch (err) {
      this.logger.error(`創建產品失敗`, {
        error: err,
        createDto: createProductDto,
      });
      throw new InternalServerErrorException('創建產品失敗');
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductInput,
    userId?: string,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, userId },
    });
    if (!product) {
      throw new NotFoundException(`產品ID ${id} 未找到`);
    }

    try {
      // 更新产品基本信息
      Object.assign(product, updateProductDto);
      console.log(product);
      return this.productRepository.save(product);
    } catch (err) {
      this.logger.error(`更新產品失敗`, {
        error: err,
        productId: id,
        updateDto: updateProductDto,
      });
      throw new InternalServerErrorException('更新產品失敗');
    }
  }

  async delete(id: string, userId?: string): Promise<boolean> {
    const result = await this.productRepository.delete({
      id,
      userId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`產品ID ${id} 未找到`);
    }
    return true;
  }
}
