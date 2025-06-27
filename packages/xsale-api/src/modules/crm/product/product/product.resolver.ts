import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Product } from '@/entities/product.entity';
import { ProductService } from './product.service';
import { ProductPagination, ProductWhereInput } from './product.dto';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => ProductPagination)
  @UseGuards(GqlAuthGuard)
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
  async product(@Args('id') id: string): Promise<Product> {
    return await this.productService.findOne(id);
  }
}
