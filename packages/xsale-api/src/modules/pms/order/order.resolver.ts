import { Resolver, Query, Args, Int, Context, Mutation } from '@nestjs/graphql';
import { UseGuards, NotFoundException } from '@nestjs/common';
import { Order } from '@/entities/order.entity';
import { OrderService } from './order.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { OrderPagination, OrderWhereInput } from './order.dto';
import { PmsContext } from '@/types/graphql-context';
import { CommonOrderService } from '@/modules/_common/order/order.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly commonOrderService: CommonOrderService,
  ) {}

  @Query(() => OrderPagination)
  @UseGuards(GqlAuthGuard)
  async orders(
    @Context() ctx: PmsContext,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => OrderWhereInput, defaultValue: {} })
    where?: OrderWhereInput,
  ): Promise<OrderPagination> {
    return await this.orderService.findAll({
      skip,
      take,
      where,
      merchantId: ctx.req.user?.id,
    });
  }

  @Query(() => Order)
  @UseGuards(GqlAuthGuard)
  async order(
    @Context() ctx: PmsContext,
    @Args('id') id: string,
  ): Promise<Order> {
    return await this.orderService.findOne(id, ctx.req.user?.id);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async completeOrder(
    @Context() ctx: PmsContext,
    @Args('id') id: string,
  ): Promise<Order> {
    return this.commonOrderService.complete(id, {
      customValidation: (order) => {
        if (order.merchantId !== ctx.req.user?.id) {
          throw new NotFoundException(`Order ${id} not found`);
        }
      },
    });
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async refundOrder(
    @Context() ctx: PmsContext,
    @Args('id') id: string,
    @Args('reason', { nullable: true }) reason?: string,
  ): Promise<Order> {
    return await this.commonOrderService.refund(id, {
      customValidation: (order) => {
        if (ctx.req.user?.id && order.merchantId !== ctx.req.user?.id) {
          throw new Error(`Order ${id} not found`);
        }
      },
      reason,
    });
  }
}
