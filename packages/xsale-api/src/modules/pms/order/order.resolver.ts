import { Resolver, Query, Args, Int, Context, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
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
    return this.orderService.complete(id, ctx.req.user?.id);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async refundOrder(
    @Context() ctx: PmsContext,
    @Args('id') id: string,
  ): Promise<Order> {
    const merchantId = ctx.req.user?.id;
    try {
      return await this.commonOrderService.refundOrder(id, {
        customValidation: (order) => {
          if (merchantId && order.merchantId !== merchantId) {
            throw new Error(`Order ${id} not found`);
          }
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('退款失败');
    }
  }
}
