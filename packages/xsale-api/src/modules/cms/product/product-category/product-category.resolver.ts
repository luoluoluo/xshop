import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
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
import { RequirePermission } from '../../auth/decorators/require-permission.decorator';

@Resolver(() => ProductCategory)
export class ProductCategoryResolver {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Query(() => ProductCategoryPagination)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('product-category.list')
  async productCategories(
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => ProductCategoryWhereInput, defaultValue: {} })
    where?: ProductCategoryWhereInput,
  ): Promise<ProductCategoryPagination> {
    return await this.productCategoryService.findAll({
      skip,
      take,
      where,
    });
  }

  @Query(() => ProductCategory)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('product-category.show')
  async productCategory(@Args('id') id: string): Promise<ProductCategory> {
    return await this.productCategoryService.findOne(id);
  }

  @Mutation(() => ProductCategory)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('product-category.create')
  async createProductCategory(
    @Args('data') data: CreateProductCategoryInput,
  ): Promise<ProductCategory> {
    return await this.productCategoryService.create(data);
  }

  @Mutation(() => ProductCategory)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('product-category.edit')
  async updateProductCategory(
    @Args('id') id: string,
    @Args('data') data: UpdateProductCategoryInput,
  ): Promise<ProductCategory> {
    return await this.productCategoryService.update(id, data);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('product-category.delete')
  async deleteProductCategory(@Args('id') id: string): Promise<boolean> {
    return await this.productCategoryService.delete(id);
  }
}
