import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Order } from '@/entities/order.entity';
import { OrderService } from './order.service';
import { RequirePermission } from '@/modules/_common/auth/decorators/require-permission.decorator';
import { UserAuthGuard } from '@/modules/_common/auth/guards/user-auth.guard';
import { OrderPagination, OrderWhereInput } from './order.dto';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => OrderPagination)
  @UseGuards(UserAuthGuard)
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
  @UseGuards(UserAuthGuard)
  @RequirePermission('order.show')
  async order(@Args('id') id: string): Promise<Order> {
    return await this.orderService.findOne(id);
  }
}
