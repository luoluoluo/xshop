import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductCategory } from '@/entities/product-category.entity';
import { ProductCategoryService } from './product-category.service';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import {
  CreateProductCategoryInput,
  UpdateProductCategoryInput,
  ProductCategoryPagination,
  ProductCategoryWhereInput,
} from './product-category.dto';
import { PmsContext } from '@/types/graphql-context';

@Resolver(() => ProductCategory)
export class ProductCategoryResolver {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Query(() => ProductCategoryPagination)
  @UseGuards(GqlAuthGuard)
  async productCategories(
    @Context() ctx: PmsContext,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => ProductCategoryWhereInput, defaultValue: {} })
    where?: ProductCategoryWhereInput,
  ): Promise<ProductCategoryPagination> {
    return await this.productCategoryService.findAll({
      skip,
      take,
      where,
      merchantId: ctx.req.user?.id,
    });
  }

  @Query(() => ProductCategory)
  @UseGuards(GqlAuthGuard)
  async productCategory(
    @Context() ctx: PmsContext,
    @Args('id') id: string,
  ): Promise<ProductCategory> {
    return await this.productCategoryService.findOne(id, ctx.req.user?.id);
  }

  @Mutation(() => ProductCategory)
  @UseGuards(GqlAuthGuard)
  async createProductCategory(
    @Context() ctx: PmsContext,
    @Args('data') data: CreateProductCategoryInput,
  ): Promise<ProductCategory> {
    return await this.productCategoryService.create(data, ctx.req.user?.id);
  }

  @Mutation(() => ProductCategory)
  @UseGuards(GqlAuthGuard)
  async updateProductCategory(
    @Context() ctx: PmsContext,
    @Args('id') id: string,
    @Args('data') data: UpdateProductCategoryInput,
  ): Promise<ProductCategory> {
    return await this.productCategoryService.update(id, data, ctx.req.user?.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteProductCategory(
    @Context() ctx: PmsContext,
    @Args('id') id: string,
  ): Promise<boolean> {
    return await this.productCategoryService.delete(id, ctx.req.user?.id);
  }
}
