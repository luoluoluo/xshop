import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Product } from '@/entities/product.entity';
import { ProductService } from './product.service';
import {
  CreateProductInput,
  UpdateProductInput,
  ProductPagination,
  ProductWhereInput,
} from './product.dto';
import { RequirePermission } from '@/modules/_common/auth/decorators/require-permission.decorator';
import { UserAuthGuard } from '@/modules/_common/auth/guards/user-auth.guard';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => ProductPagination)
  @UseGuards(UserAuthGuard)
  @RequirePermission('product.list')
  async products(
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => ProductWhereInput, defaultValue: {} })
    where?: ProductWhereInput,
  ): Promise<ProductPagination> {
    return await this.productService.findAll({
      skip,
      take,
      where,
    });
  }

  @Query(() => Product)
  @UseGuards(UserAuthGuard)
  @RequirePermission('product.show')
  async product(@Args('id') id: string): Promise<Product> {
    return await this.productService.findOne(id);
  }

  @Mutation(() => Product)
  @UseGuards(UserAuthGuard)
  @RequirePermission('product.create')
  async createProduct(
    @Args('data') data: CreateProductInput,
  ): Promise<Product> {
    return await this.productService.create(data);
  }

  @Mutation(() => Product)
  @UseGuards(UserAuthGuard)
  @RequirePermission('product.edit')
  async updateProduct(
    @Args('id') id: string,
    @Args('data') data: UpdateProductInput,
  ): Promise<Product> {
    return await this.productService.update(id, data);
  }

  @Mutation(() => Boolean)
  @UseGuards(UserAuthGuard)
  @RequirePermission('product.delete')
  async deleteProduct(@Args('id') id: string): Promise<boolean> {
    return await this.productService.delete(id);
  }
}
