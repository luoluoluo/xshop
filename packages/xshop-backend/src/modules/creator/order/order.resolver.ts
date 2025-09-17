import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from '@/entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { OrderPagination, OrderWhereInput } from './order.dto';
import { StoreContext } from '@/types/graphql-context';
import { WechatPayService } from '@/modules/_common/wechat-pay/wechat-pay.service';
import { CommonOrderService } from '@/modules/_common/order/order.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    protected readonly wechatPayService: WechatPayService,
    protected readonly commonOrderService: CommonOrderService,
  ) {}

  @Query(() => OrderPagination)
  @UseGuards(GqlAuthGuard)
  async orders(
    @Context() ctx: StoreContext,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => OrderWhereInput, nullable: true })
    where?: OrderWhereInput,
  ): Promise<OrderPagination> {
    return this.orderService.findAll({
      take,
      skip,
      where: {
        ...where,
        merchantId: ctx.req.user?.id,
      },
      relations: {
        customer: true,
        merchant: true,
        affiliate: true,
      },
    });
  }

  @Query(() => Order)
  @UseGuards(GqlAuthGuard)
  async order(
    @Context() ctx: StoreContext,
    @Args('id') id: string,
  ): Promise<Order> {
    return this.orderService.findOne(id, {
      where: {
        merchantId: ctx.req.user?.id,
      },
      relations: {
        customer: true,
        merchant: true,
        affiliate: true,
      },
    });
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async refundOrder(
    @Context() ctx: StoreContext,
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

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async completeOrder(
    @Context() ctx: StoreContext,
    @Args('id') id: string,
  ): Promise<Order> {
    return this.commonOrderService.complete(id, {
      customValidation: (order) => {
        if (ctx.req.user?.id && order.merchantId !== ctx.req.user?.id) {
          throw new Error(`Order ${id} not found`);
        }
      },
    });
  }
}
