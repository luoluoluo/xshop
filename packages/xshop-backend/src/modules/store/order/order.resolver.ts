import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from '@/entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '@/modules/_common/auth/guards/user-auth.guard';
import {
  CreateOrderInput,
  CreateOrderPaymentInput,
  OrderPagination,
  OrderWhereInput,
} from './order.dto';
import { WechatPayService } from '@/modules/_common/wechat-pay/wechat-pay.service';
import { Payment } from '@/modules/_common/wechat-pay/wechat-pay.dto';
import { CommonOrderService } from '@/modules/_common/order/order.service';
import { OrderStatus } from '@/types/order-status';
import { UserSession } from '@/modules/_common/auth/decorators/user-session.decorator';
import { User } from '@/entities/user.entity';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    protected readonly wechatPayService: WechatPayService,
    protected readonly commonOrderService: CommonOrderService,
  ) {}

  @Query(() => OrderPagination)
  @UseGuards(UserAuthGuard)
  async orders(
    @UserSession() user: User,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => OrderWhereInput, defaultValue: {} })
    where?: OrderWhereInput,
    @Args('isAffiliate', { type: () => Boolean, nullable: true })
    isAffiliate?: boolean,
  ): Promise<OrderPagination> {
    return this.orderService.findAll({
      take,
      skip,
      where: {
        ...where,
        customerId: isAffiliate ? undefined : user.id,
        affiliateId: isAffiliate ? user.id : undefined,
      },
    });
  }

  @Query(() => Order)
  @UseGuards(UserAuthGuard)
  async order(
    @UserSession() user: User,
    @Args('id') id: string,
    @Args('isAffiliate', { type: () => Boolean, nullable: true })
    isAffiliate?: boolean,
  ): Promise<Order> {
    return this.orderService.findOne(id, {
      where: {
        customerId: isAffiliate ? undefined : user.id,
        affiliateId: isAffiliate ? user.id : undefined,
      },
    });
  }

  @Mutation(() => Order)
  @UseGuards(UserAuthGuard)
  async createOrder(
    @UserSession() user: User,
    @Args('data') data: CreateOrderInput,
  ): Promise<Order> {
    return this.orderService.create(user.id, data);
  }

  @Mutation(() => Payment)
  async createOrderPayment(
    @Args('data') data: CreateOrderPaymentInput,
  ): Promise<Payment> {
    return this.commonOrderService.createPayment({
      orderId: data.orderId,
      openId: data.openId,
    });
  }

  @Query(() => OrderStatus)
  async orderStatus(@Args('id') id: string): Promise<OrderStatus> {
    return this.orderService.findOne(id).then((order) => order.status);
  }

  @Mutation(() => Order)
  @UseGuards(UserAuthGuard)
  async refundOrder(
    @UserSession() user: User,
    @Args('id') id: string,
    @Args('reason', { nullable: true }) reason?: string,
  ): Promise<Order> {
    return await this.commonOrderService.refund(id, {
      customValidation: (order) => {
        if (user.id && order.merchantId !== user.id) {
          throw new Error(`Order ${id} not found`);
        }
      },
      reason,
    });
  }
}
