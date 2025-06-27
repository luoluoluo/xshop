import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
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
import { PmsContext } from '@/types/graphql-context';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => ProductPagination)
  @UseGuards(GqlAuthGuard)
  async products(
    @Context() ctx: PmsContext,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => ProductWhereInput, defaultValue: {} })
    where?: ProductWhereInput,
  ): Promise<ProductPagination> {
    return await this.productService.findAll({
      skip,
      take,
      where,
      merchantId: ctx.req.user?.id,
    });
  }

  @Query(() => Product)
  @UseGuards(GqlAuthGuard)
  async product(
    @Context() ctx: PmsContext,
    @Args('id') id: string,
  ): Promise<Product> {
    return await this.productService.findOne(id, ctx.req.user?.id);
  }

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard)
  async createProduct(
    @Context() ctx: PmsContext,
    @Args('data') data: CreateProductInput,
  ): Promise<Product> {
    return await this.productService.create(data, ctx.req.user?.id);
  }

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard)
  async updateProduct(
    @Context() ctx: PmsContext,
    @Args('id') id: string,
    @Args('data') data: UpdateProductInput,
  ): Promise<Product> {
    return await this.productService.update(id, data, ctx.req.user?.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteProduct(
    @Context() ctx: PmsContext,
    @Args('id') id: string,
  ): Promise<boolean> {
    return await this.productService.delete(id, ctx.req.user?.id);
  }
}
