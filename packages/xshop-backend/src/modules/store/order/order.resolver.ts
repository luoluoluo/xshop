import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from '@/entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import {
  CreateOrderInput,
  CreateOrderPaymentInput,
  OrderPagination,
  OrderWhereInput,
} from './order.dto';
import { StoreContext } from '@/types/graphql-context';
import { WechatPayService } from '@/modules/_common/wechat-pay/wechat-pay.service';
import { Payment } from '@/modules/_common/wechat-pay/wechat-pay.dto';
import { CommonOrderService } from '@/modules/_common/order/order.service';
import { OrderStatus } from '@/types/order-status';

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
    @Args('where', { type: () => OrderWhereInput, defaultValue: {} })
    where?: OrderWhereInput,
  ): Promise<OrderPagination> {
    return this.orderService.findAll({
      take,
      skip,
      where: {
        ...where,
        merchantId: ctx.req.user?.id,
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
      merchantId: ctx.req.user?.id,
    });
  }

  @Query(() => OrderPagination)
  async affiliateOrders(
    @Context() ctx: StoreContext,
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
  async affiliateOrder(
    @Context() ctx: StoreContext,
    @Args('id') id: string,
  ): Promise<Order> {
    return this.orderService.findOne(id, {
      affiliateId: ctx.req.user?.id,
    });
  }

  @Query(() => OrderPagination)
  async customerOrders(
    @Context() ctx: StoreContext,
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
        customerId: ctx.req.user?.id,
      },
    });
  }

  @Query(() => Order)
  @UseGuards(GqlAuthGuard)
  async customerOrder(
    @Context() ctx: StoreContext,
    @Args('id') id: string,
  ): Promise<Order> {
    return this.orderService.findOne(id, {
      customerId: ctx.req.user?.id,
    });
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async createOrder(
    @Context() ctx: StoreContext,
    @Args('data') data: CreateOrderInput,
  ): Promise<Order> {
    return this.orderService.create(ctx.req.user!.id, data);
  }

  @Mutation(() => Payment)
  async createOrderPayment(
    @Context() context: StoreContext,
    @Args('data') data: CreateOrderPaymentInput,
  ): Promise<Payment> {
    /** notify url  */
    const { req } = context;
    const host = req.get('host');
    const isLocalhost =
      host?.includes('localhost') || host?.includes('127.0.0.1');
    const protocol = isLocalhost ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    const notifyUrl = `${baseUrl}/wechat-pay/notify`;
    /** notify url end */

    return this.commonOrderService.createPayment({
      orderId: data.orderId,
      notifyUrl,
      openId: data.openId,
    });
  }

  @Query(() => OrderStatus)
  async orderStatus(@Args('id') id: string): Promise<OrderStatus> {
    return this.orderService.findOne(id).then((order) => order.status);
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
}
