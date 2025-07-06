import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { Order, OrderStatus } from '@/entities/order.entity';
import { Product } from '@/entities/product.entity';
import { WechatPayService } from '../wechat-pay/wechat-pay.service';
import { Affiliate } from '@/entities/affiliate.entity';
import { Merchant } from '@/entities/merchant.entity';

export interface CancelOrderOptions {
  /** 自定义验证函数 */
  customValidation?: (order: Order) => void | Promise<void>;
}

export interface RefundOrderOptions {
  /** 自定义验证函数 */
  customValidation?: (order: Order) => void | Promise<void>;
  /** 退款原因 */
  reason?: string;
  /** 是否跳过微信退款调用（用于测试或其他支付方式） */
  skipWechatRefund?: boolean;
}

@Injectable()
export class CommonOrderService {
  private readonly logger = new Logger(CommonOrderService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly wechatPayService: WechatPayService,
  ) {}

  /**
   * 取消单个订单
   */
  async cancelOrder(
    orderId: string,
    options: CancelOrderOptions = {},
    queryRunner?: QueryRunner,
  ): Promise<Order> {
    const { customValidation } = options;

    const shouldManageTransaction = !queryRunner;
    const runner = queryRunner || this.dataSource.createQueryRunner();

    if (shouldManageTransaction) {
      await runner.connect();
      await runner.startTransaction();
    }

    try {
      const order = await runner.manager.findOne(Order, {
        where: { id: orderId },
      });

      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      // 状态检查
      if (order.status !== OrderStatus.CREATED) {
        throw new BadRequestException('只有已创建的订单才能取消');
      }

      // 自定义验证
      if (customValidation) {
        await customValidation(order);
      }

      // 更新订单状态
      order.status = OrderStatus.CANCELLED;
      order.cancelledAt = new Date();

      const savedOrder = await runner.manager.save(order);

      // 恢复库存
      await runner.manager.update(
        Product,
        { id: order.productId },
        { stock: () => `stock + ${order.quantity}` },
      );

      if (shouldManageTransaction) {
        await runner.commitTransaction();
      }

      this.logger.log(
        `Successfully cancelled order ${orderId} and restored stock ${order.quantity}`,
      );

      return savedOrder;
    } catch (error) {
      if (shouldManageTransaction) {
        await runner.rollbackTransaction();
      }
      this.logger.error(`Failed to cancel order ${orderId}`, error);
      throw error;
    } finally {
      if (shouldManageTransaction) {
        await runner.release();
      }
    }
  }

  /**
   * 退款订单
   */
  async refundOrder(
    orderId: string,
    options: RefundOrderOptions = {},
    queryRunner?: QueryRunner,
  ): Promise<Order> {
    const { customValidation, reason, skipWechatRefund } = options;

    const shouldManageTransaction = !queryRunner;
    const runner = queryRunner || this.dataSource.createQueryRunner();

    if (shouldManageTransaction) {
      await runner.connect();
      await runner.startTransaction();
    }

    try {
      const order = await runner.manager.findOne(Order, {
        where: { id: orderId },
        relations: {
          product: true,
        },
      });

      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      // 状态检查
      if (order.status !== OrderStatus.PAID) {
        throw new BadRequestException('只有已支付的订单才能退款');
      }

      // 自定义验证
      if (customValidation) {
        await customValidation(order);
      }

      // 调用微信退款接口（在更新订单状态之前）
      if (!skipWechatRefund) {
        try {
          const refundParams = {
            out_refund_no: `REFUND-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            amount: {
              total: Math.floor(order.amount * 100), // 微信支付金额以分为单位
              currency: 'CNY',
              refund: Math.floor(order.amount * 100),
            },
            out_trade_no: order.id,
          };

          await this.wechatPayService.refund(refundParams);
          this.logger.log(`Wechat refund successful for order ${orderId}`);
        } catch (error) {
          this.logger.error(`Wechat refund failed for order ${orderId}`, error);
          throw new Error(`微信退款失败: ${error.message}`);
        }
      }

      // 更新订单状态
      order.status = OrderStatus.REFUNDED;
      order.refundedAt = new Date();
      if (reason) {
        order.note = order.note
          ? `${order.note} [退款原因: ${reason}]`
          : `退款原因: ${reason}`;
      }

      const savedOrder = await runner.manager.save(order);

      // 恢复库存
      await runner.manager.update(
        Product,
        { id: order.productId },
        { stock: () => `stock + ${order.quantity}` },
      );

      if (shouldManageTransaction) {
        await runner.commitTransaction();
      }

      this.logger.log(
        `Successfully refunded order ${orderId} and restored stock ${order.quantity}`,
      );

      return savedOrder;
    } catch (error) {
      if (shouldManageTransaction) {
        await runner.rollbackTransaction();
      }
      this.logger.error(`Failed to refund order ${orderId}`, error);
      throw error;
    } finally {
      if (shouldManageTransaction) {
        await runner.release();
      }
    }
  }

  /**
   * 完成订单并处理相关余额更新
   */
  async completeOrder(
    orderId: string,
    options: {
      customValidation?: (order: Order) => void | Promise<void>;
    },
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {
        where: { id: orderId },
        relations: {
          product: true,
          merchant: true,
          affiliate: true,
          customer: true,
        },
      });

      if (!order) {
        throw new NotFoundException(`Order ${orderId} not found`);
      }
      if (options?.customValidation) {
        await options.customValidation(order);
      }
      if (order.status !== OrderStatus.PAID) {
        throw new BadRequestException('只有已支付的订单才能完成');
      }

      const merchantAffiliate = await queryRunner.manager.findOne(Affiliate, {
        where: { id: order.merchantAffiliateId },
      });

      if (!merchantAffiliate) {
        throw new BadRequestException('商户客户经理不存在');
      }

      const affiliate = await queryRunner.manager.findOne(Affiliate, {
        where: { id: order.affiliateId },
      });
      if (!affiliate) {
        throw new BadRequestException('推广者不存在');
      }

      const merchant = await queryRunner.manager.findOne(Merchant, {
        where: { id: order.merchantId },
      });
      if (!merchant) {
        throw new BadRequestException('商户不存在');
      }

      // 更新订单状态
      order.status = OrderStatus.COMPLETED;
      order.completedAt = new Date();
      const savedOrder = await queryRunner.manager.save(order);

      // 检查推广者和招商经理是否是同一个人
      if (affiliate.id === merchantAffiliate.id) {
        // 同一个人，累加两个金额一次性更新
        affiliate.balance =
          Number(affiliate.balance) +
          Number(order.affiliateAmount || 0) +
          Number(order.merchantAffiliateAmount || 0);
        await queryRunner.manager.save(affiliate);
      } else {
        // 不同的人，分别更新余额
        // 更新推广者余额
        affiliate.balance =
          Number(affiliate.balance) + Number(order.affiliateAmount || 0);
        await queryRunner.manager.save(affiliate);

        // 更新商户客户经理余额
        merchantAffiliate.balance =
          Number(merchantAffiliate.balance) +
          Number(order.merchantAffiliateAmount || 0);
        await queryRunner.manager.save(merchantAffiliate);
      }

      if (order.merchantId) {
        // 更新商户余额
        merchant.balance =
          Number(merchant.balance) + Number(order.merchantAmount || 0);
        await queryRunner.manager.save(merchant);
      }
      // 提交事务
      await queryRunner.commitTransaction();

      return savedOrder;
    } catch (error) {
      this.logger.error(`完成订单失败`, {
        error,
        orderId,
      });
      // 回滚事务
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 释放连接
      await queryRunner.release();
    }
  }
}
