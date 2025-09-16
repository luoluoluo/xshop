import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Order } from '@/entities/order.entity';
import { OrderStatus } from '@/types/order-status';
import { Product } from '@/entities/product.entity';
import { CommonOrderService } from '../order/order.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly commonOrderService: CommonOrderService,
  ) {}

  /**
   * Auto-cancel unpaid orders after 30 minutes
   * Runs every 5 minutes
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async cancelExpiredOrders(): Promise<void> {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      const expiredOrders = await this.orderRepository.find({
        where: {
          status: OrderStatus.CREATED,
          createdAt: LessThan(thirtyMinutesAgo),
        },
      });

      if (expiredOrders.length === 0) {
        this.logger.debug('No expired orders found');
        return;
      }

      await Promise.all(
        expiredOrders.map(async (order) => {
          try {
            await this.commonOrderService.cancel(order.id);
          } catch (error) {
            this.logger.error(`Failed to cancel order ${order.id}`, error);
          }
        }),
      );
    } catch (error) {
      this.logger.error('Failed to cancel expired orders', error);
    }
  }

  /**
   * Auto-complete paid orders after 7 days
   * Runs every hour
   */
  @Cron(CronExpression.EVERY_HOUR)
  async autoCompleteOrders(): Promise<void> {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const paidOrders = await this.orderRepository.find({
        where: {
          status: OrderStatus.PAID,
          paidAt: LessThan(sevenDaysAgo),
        },
      });

      if (paidOrders.length === 0) {
        this.logger.debug('No orders to auto-complete found');
        return;
      }

      this.logger.log(`Found ${paidOrders.length} orders to auto-complete`);

      await Promise.all(
        paidOrders.map(async (order) => {
          try {
            await this.commonOrderService.complete(order.id, {});
            this.logger.log(`Successfully auto-completed order ${order.id}`);
          } catch (error) {
            this.logger.error(
              `Failed to auto-complete order ${order.id}`,
              error,
            );
          }
        }),
      );
    } catch (error) {
      this.logger.error('Failed to auto-complete orders', error);
    }
  }
}
