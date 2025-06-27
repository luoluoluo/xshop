import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
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
import { ProductAttribute } from '@/entities/product-attribute.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductAttribute)
    private readonly attributeRepository: Repository<ProductAttribute>,
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
        category: true,
        attributes: true,
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
        category: true,
        attributes: true,
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
      const { attributes, ...productData } = createProductDto;

      // 创建产品
      const product = this.productRepository.create(productData);
      await this.productRepository.save(product);

      // 创建属性
      if (attributes?.length) {
        const productAttributes = attributes.map((attribute) =>
          this.attributeRepository.create({
            ...attribute,
            productId: product.id,
          }),
        );
        await this.attributeRepository.save(productAttributes);
      }

      return this.findOne(product.id);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('創建產品失敗');
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductInput,
  ): Promise<Product> {
    const product = await this.findOne(id);

    try {
      const { attributes, ...productData } = updateProductDto;

      // 更新产品基本信息
      Object.assign(product, productData);

      await this.productRepository.save(product);

      // 更新属性
      await this.attributeRepository.delete({ productId: id });
      if (attributes?.length) {
        const productAttributes = attributes.map((attribute) =>
          this.attributeRepository.create({
            ...attribute,
            productId: id,
          }),
        );
        await this.attributeRepository.save(productAttributes);
      }

      return this.findOne(id);
    } catch (err) {
      console.error(err);
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
