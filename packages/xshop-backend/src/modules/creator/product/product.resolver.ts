import { Resolver, Query, Args, Int, Mutation, Context } from '@nestjs/graphql';
import { Product } from '@/entities/product.entity';
import { ProductService } from './product.service';
import {
  CreateProductInput,
  ProductPagination,
  ProductWhereInput,
  UpdateProductInput,
} from './product.dto';
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

  @Mutation(() => Product)
  @UseGuards(UserAuthGuard)
  async createProduct(
    @UserSession() user: User,
    @Args('data') data: CreateProductInput,
  ): Promise<Product> {
    return await this.productService.create({
      ...data,
      userId: user.id,
    });
  }

  @Mutation(() => Product)
  @UseGuards(UserAuthGuard)
  async updateProduct(
    @UserSession() user: User,
    @Args('id') id: string,
    @Args('data') data: UpdateProductInput,
  ): Promise<Product> {
    return await this.productService.update(id, data, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(UserAuthGuard)
  async deleteProduct(
    @UserSession() user: User,
    @Args('id') id: string,
  ): Promise<boolean> {
    return await this.productService.delete(id, user.id);
  }
}
