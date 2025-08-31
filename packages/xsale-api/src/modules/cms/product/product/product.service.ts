import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@/entities/product.entity';
import {
  CreateProductInput,
  ProductPagination,
  ProductWhereInput,
  UpdateProductInput,
} from './product.dto';
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
    where = {},
  }: {
    skip?: number;
    take?: number;
    where?: ProductWhereInput;
  }): Promise<ProductPagination> {
    const [items, total] = await this.productRepository.findAndCount({
      where,
      skip,
      take,
      relations: {
        merchant: true,
      },
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        merchant: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`產品ID ${id} 未找到`);
    }
    return product;
  }

  async create(createProductDto: CreateProductInput): Promise<Product> {
    try {
      // 创建产品
      const product = this.productRepository.create(createProductDto);
      return this.productRepository.save(product);
    } catch (err) {
      this.logger.error('創建產品失敗', {
        error: err,
        createDto: createProductDto,
      });
      throw new InternalServerErrorException('創建產品失敗');
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductInput,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`產品ID ${id} 未找到`);
    }

    try {
      // 更新产品基本信息
      Object.assign(product, updateProductDto);

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

  async delete(id: string): Promise<boolean> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`產品ID ${id} 未找到`);
    }
    return true;
  }
}
