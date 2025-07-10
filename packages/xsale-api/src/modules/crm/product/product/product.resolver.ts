import { Resolver, Query, Args, Int, Context } from '@nestjs/graphql';
import { Product } from '@/entities/product.entity';
import { ProductService } from './product.service';
import { ProductPagination, ProductWhereInput } from './product.dto';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CrmContext } from '@/types/graphql-context';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => ProductPagination)
  @UseGuards(GqlAuthGuard)
  async products(
    @Context() ctx: CrmContext,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => ProductWhereInput, defaultValue: {} })
    where?: ProductWhereInput,
  ): Promise<ProductPagination> {
    // 从上下文获取当前推广者ID
    const affiliateId = ctx.req.user?.id;

    return await this.productService.findAll({
      skip,
      take,
      where,
      affiliateId, // 传递推广者ID
    });
  }

  @Query(() => Product)
  @UseGuards(GqlAuthGuard)
  async product(@Args('id') id: string): Promise<Product> {
    return await this.productService.findOne(id);
  }
}
