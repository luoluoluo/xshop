import { Resolver, Query, Args, Context, Int } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from '@/entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { OrderPagination, OrderWhereInput } from './order.dto';
import { CrmContext } from '@/types/graphql-context';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => OrderPagination)
  @UseGuards(GqlAuthGuard)
  async orders(
    @Context() ctx: CrmContext,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => OrderWhereInput, defaultValue: {} })
    where?: OrderWhereInput,
  ): Promise<OrderPagination> {
    return this.orderService.findAll({
      take,
      skip,
      where: {
        ...where,
        affiliateId: ctx.req.user?.id,
      },
    });
  }

  @Query(() => Order)
  @UseGuards(GqlAuthGuard)
  async order(
    @Context() ctx: CrmContext,
    @Args('id') id: string,
  ): Promise<Order> {
    return this.orderService.findOne(id, {
      affiliateId: ctx.req.user?.id,
    });
  }
}
