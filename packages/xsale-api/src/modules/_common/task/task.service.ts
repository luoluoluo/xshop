import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Order, OrderStatus } from '@/entities/order.entity';
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
            await this.commonOrderService.cancelOrder(order.id);
          } catch (error) {
            this.logger.error(`Failed to cancel order ${order.id}`, error);
          }
        }),
      );
    } catch (error) {
      this.logger.error('Failed to cancel expired orders', error);
    }
  }
}
