import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Product } from '@/entities/product.entity';
import { ProductService } from './product.service';
import { ProductPagination, ProductWhereInput } from './product.dto';
import { SorterInput } from '@/types/sorter';
import { UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '@/modules/_common/auth/guards/user-auth.guard';
import { UserSession } from '@/modules/_common/auth/decorators/user-session.decorator';
import { User } from '@/entities/user.entity';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => ProductPagination)
  @UseGuards(UserAuthGuard)
  async products(
    @UserSession() user: User,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => ProductWhereInput, nullable: true })
    where?: ProductWhereInput,
    @Args('sorters', { type: () => [SorterInput], nullable: true })
    sorters?: SorterInput[],
  ): Promise<ProductPagination> {
    return await this.productService.findAll({
      skip,
      take,
      where: {
        ...where,
        userId: user.id,
      },
      sorters,
    });
  }

  @Query(() => Product)
  async product(@Args('id') id: string): Promise<Product> {
    return await this.productService.findOne(id);
  }
}
