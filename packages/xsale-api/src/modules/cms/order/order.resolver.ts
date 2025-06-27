import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Order } from '@/entities/order.entity';
import { OrderService } from './order.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { OrderPagination, OrderWhereInput } from './order.dto';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => OrderPagination)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('order.list')
  async orders(
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => OrderWhereInput, defaultValue: {} })
    where?: OrderWhereInput,
  ): Promise<OrderPagination> {
    return await this.orderService.findAll({
      skip,
      take,
      where,
    });
  }

  @Query(() => Order)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('order.show')
  async order(@Args('id') id: string): Promise<Order> {
    return await this.orderService.findOne(id);
  }
}
