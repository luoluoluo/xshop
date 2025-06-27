import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Product } from '@/entities/product.entity';
import { ProductService } from './product.service';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import {
  CreateProductInput,
  UpdateProductInput,
  ProductPagination,
  ProductWhereInput,
} from './product.dto';
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => ProductPagination)
  @UseGuards(GqlAuthGuard)
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
  @UseGuards(GqlAuthGuard)
  @RequirePermission('product.show')
  async product(@Args('id') id: string): Promise<Product> {
    return await this.productService.findOne(id);
  }

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('product.create')
  async createProduct(
    @Args('data') data: CreateProductInput,
  ): Promise<Product> {
    return await this.productService.create(data);
  }

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('product.edit')
  async updateProduct(
    @Args('id') id: string,
    @Args('data') data: UpdateProductInput,
  ): Promise<Product> {
    return await this.productService.update(id, data);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('product.delete')
  async deleteProduct(@Args('id') id: string): Promise<boolean> {
    return await this.productService.delete(id);
  }
}
