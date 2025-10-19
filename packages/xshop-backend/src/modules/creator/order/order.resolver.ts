import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from '@/entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '@/modules/_common/auth/guards/user-auth.guard';
import { OrderPagination, OrderWhereInput } from './order.dto';
import { WechatPayService } from '@/modules/_common/wechat-pay/wechat-pay.service';
import { CommonOrderService } from '@/modules/_common/order/order.service';
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
  async orders(
    @UserSession() user: User,
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
        merchantId: user.id,
      },
      relations: {
        customer: true,
        merchant: true,
        affiliate: true,
      },
    });
  }

  @Query(() => Order)
  @UseGuards(UserAuthGuard)
  async order(
    @UserSession() user: User,
    @Args('id') id: string,
  ): Promise<Order> {
    return this.orderService.findOne(id, {
      where: {
        merchantId: user.id,
      },
      relations: {
        customer: true,
        merchant: true,
        affiliate: true,
      },
    });
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

  @Mutation(() => Order)
  @UseGuards(UserAuthGuard)
  async completeOrder(
    @UserSession() user: User,
    @Args('id') id: string,
  ): Promise<Order> {
    return this.commonOrderService.complete(id, {
      customValidation: (order) => {
        if (user.id && order.merchantId !== user.id) {
          throw new Error(`Order ${id} not found`);
        }
      },
    });
  }
}
