import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order, OrderStatus } from '@/entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/modules/web/auth/guards/gql-auth.guard';
import {
  CreateOrderInput,
  OrderPagination,
  OrderWhereInput,
  RefundOrderInput,
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

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly wechatPayService: WechatPayService,
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
    return this.orderService.findAll({
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
    return this.orderService.findAll({
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
    return this.orderService.findOne(id, {
      affiliateId: ctx.req.user?.id,
    });
  }

  @Query(() => Order)
  @UseGuards(GqlAuthGuard)
  async order(
    @Context() ctx: WebContext,
    @Args('id') id: string,
  ): Promise<Order> {
    return this.orderService.findOne(id, {
      customerId: ctx.req.user?.id,
    });
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async createOrder(
    @Context() ctx: WebContext,
    @Args('data') data: CreateOrderInput,
  ): Promise<Order> {
    return this.orderService.create(ctx.req.user!.id, data);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async cancelOrder(
    @Context() ctx: WebContext,
    @Args('id') id: string,
  ): Promise<Order> {
    return this.orderService.cancel(id, ctx.req.user?.id);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async refundOrder(
    @Context() ctx: WebContext,
    @Args('data') data: RefundOrderInput,
  ): Promise<Order> {
    const customerId = ctx.req.user?.id;

    // 先验证订单
    const order = await this.orderService.findOne(data.orderId, {
      customerId,
    });

    if (order.status !== OrderStatus.PAID) {
      throw new Error('Only paid orders can be refunded');
    }

    // 调用微信退款接口
    try {
      const refundParams = {
        out_refund_no: `REFUND-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        amount: {
          total: order.amount,
          currency: 'CNY',
          refund: order.amount,
        },
        out_trade_no: order.id,
      };

      await this.wechatPayService.refund(refundParams);
    } catch (error) {
      throw new Error(`退款失败: ${error.message}`);
    }

    // 更新订单状态
    return this.orderService.refund(data.orderId, customerId, data.reason);
  }

  @Mutation(() => Payment)
  async createOrderPayment(
    @Context() context: WebContext,
    @Args('data') data: CreatePaymentInput,
  ): Promise<Payment> {
    // 验证订单
    const order = await this.orderService.findOne(data.orderId);

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
        total: order.amount,
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
    return this.orderService.findOne(id).then((order) => order.status);
  }
}
