import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ProductCategory } from '@/entities/product-category.entity';
import { ProductCategoryService } from './product-category.service';
import {
  ProductCategoryPagination,
  ProductCategoryWhereInput,
} from './product-category.dto';

@Resolver(() => ProductCategory)
export class ProductCategoryResolver {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Query(() => ProductCategoryPagination)
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
  async productCategory(@Args('id') id: string): Promise<ProductCategory> {
    return await this.productCategoryService.findOne(id);
  }
}
