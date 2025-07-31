import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Product } from '@/entities/product.entity';
import { ProductService } from './product.service';
import {
  ProductOrderByInput,
  ProductPagination,
  ProductWhereInput,
} from './product.dto';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => ProductPagination)
  async products(
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => ProductWhereInput, defaultValue: {} })
    where?: ProductWhereInput,
    @Args('orderBy', { type: () => ProductOrderByInput, defaultValue: {} })
    orderBy?: ProductOrderByInput,
  ): Promise<ProductPagination> {
    return await this.productService.findAll({
      skip,
      take,
      where,
      orderBy,
    });
  }

  @Query(() => Product)
  async product(@Args('id') id: string): Promise<Product> {
    return await this.productService.findOne(id);
  }
}
