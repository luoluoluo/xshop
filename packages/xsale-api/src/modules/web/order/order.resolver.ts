import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order, OrderStatus } from '@/entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/modules/web/auth/guards/gql-auth.guard';
import {
  CreateOrderInput,
  OrderPagination,
  OrderWhereInput,
} from './order.dto';
import { WebContext } from '@/types/graphql-context';
import {
  TransactionRequest,
  WechatPayService,
} from '@/modules/_common/wechat-pay/wechat-pay.service';
import {
  CreatePaymentInput,
  Payment,
} from '@/modules/_common/wechat-pay/wechat-pay.dto';
import { CommonOrderService } from '@/modules/_common/order/order.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly webOrderService: OrderService,
    protected readonly wechatPayService: WechatPayService,
    protected readonly commonOrderService: CommonOrderService,
  ) {}

  @Query(() => OrderPagination)
  @UseGuards(GqlAuthGuard)
  async affiliateOrders(
    @Context() ctx: WebContext,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => OrderWhereInput, defaultValue: {} })
    where?: OrderWhereInput,
  ): Promise<OrderPagination> {
    return this.webOrderService.findAll({
      take,
      skip,
      where,
      affiliateId: ctx.req.user?.id,
    });
  }

  @Query(() => OrderPagination)
  @UseGuards(GqlAuthGuard)
  async orders(
    @Context() ctx: WebContext,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => OrderWhereInput, defaultValue: {} })
    where?: OrderWhereInput,
  ): Promise<OrderPagination> {
    return this.webOrderService.findAll({
      take,
      skip,
      where,
      customerId: ctx.req.user?.id,
    });
  }

  @Query(() => Order)
  @UseGuards(GqlAuthGuard)
  async affiliateOrder(
    @Context() ctx: WebContext,
    @Args('id') id: string,
  ): Promise<Order> {
    return this.webOrderService.findOne(id, {
      affiliateId: ctx.req.user?.id,
    });
  }

  @Query(() => Order)
  @UseGuards(GqlAuthGuard)
  async order(
    @Context() ctx: WebContext,
    @Args('id') id: string,
  ): Promise<Order> {
    return this.webOrderService.findOne(id, {
      customerId: ctx.req.user?.id,
    });
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async createOrder(
    @Context() ctx: WebContext,
    @Args('data') data: CreateOrderInput,
  ): Promise<Order> {
    return this.webOrderService.create(ctx.req.user!.id, data);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async cancelOrder(
    @Context() ctx: WebContext,
    @Args('id') id: string,
  ): Promise<Order> {
    return this.webOrderService.cancel(id, ctx.req.user?.id);
  }

  @Mutation(() => Payment)
  async createOrderPayment(
    @Context() context: WebContext,
    @Args('data') data: CreatePaymentInput,
  ): Promise<Payment> {
    // 验证订单
    const order = await this.webOrderService.findOne(data.orderId);

    if (order.status !== OrderStatus.CREATED) {
      throw new Error('Only created orders can be paid');
    }
    /** notify url  */
    const { req } = context;
    const host = req.get('host');
    const isLocalhost =
      host?.includes('localhost') || host?.includes('127.0.0.1');
    const protocol = isLocalhost ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    const notifyUrl = `${baseUrl}/wechat-pay/notify`;
    /** notify url end */

    // 构建支付参数
    const paymentParams: TransactionRequest = {
      description: `Order payment for ${order.id}`,
      out_trade_no: order.id,
      amount: {
        total: Math.floor(order.amount * 100),
        currency: 'CNY',
      },
      payer: {
        openid: data.openId,
      },
      notify_url: notifyUrl,
    };

    // 调用微信支付接口
    const paymentResult =
      await this.wechatPayService.createTransactionsJsapi(paymentParams);

    return {
      appId: paymentResult.appId,
      timeStamp: paymentResult.timeStamp,
      nonceStr: paymentResult.nonceStr,
      package: paymentResult.package,
      signType: paymentResult.signType,
      paySign: paymentResult.paySign,
    };
  }

  @Query(() => OrderStatus)
  async orderStatus(@Args('id') id: string): Promise<OrderStatus> {
    return this.webOrderService.findOne(id).then((order) => order.status);
  }
}
