import {
  Injectable,
  NotFoundException,
  ConflictException,
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
    merchantId,
  }: {
    skip?: number;
    take?: number;
    where?: ProductWhereInput;
    merchantId?: string;
  }): Promise<ProductPagination> {
    const [items, total] = await this.productRepository.findAndCount({
      where: {
        ...where,
        merchantId,
      },
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

  async findOne(id: string, merchantId?: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, merchantId },
      relations: {
        merchant: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`產品ID ${id} 未找到`);
    }
    return product;
  }

  async create(
    createProductDto: CreateProductInput,
    merchantId?: string,
  ): Promise<Product> {
    try {
      // 创建产品
      const product = this.productRepository.create({
        ...createProductDto,
        merchantId,
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
    merchantId?: string,
  ): Promise<Product> {
    const product = await this.findOne(id, merchantId);

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

  async delete(id: string, merchantId?: string): Promise<boolean> {
    const result = await this.productRepository.delete({
      id,
      merchantId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`產品ID ${id} 未找到`);
    }
    return true;
  }
}
