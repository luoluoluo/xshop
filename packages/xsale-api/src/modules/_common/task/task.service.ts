import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, DataSource } from 'typeorm';
import { Order, OrderStatus } from '@/entities/order.entity';
import { Product } from '@/entities/product.entity';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Auto-cancel unpaid orders after 30 minutes
   * Runs every 5 minutes
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async cancelExpiredOrders(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      const expiredOrders = await queryRunner.manager.find(Order, {
        where: {
          status: OrderStatus.CREATED,
          createdAt: LessThan(thirtyMinutesAgo),
        },
      });

      if (expiredOrders.length === 0) {
        this.logger.debug('No expired orders found');
        await queryRunner.commitTransaction();
        return;
      }

      const orderIds = expiredOrders.map((order) => order.id);

      // 更新订单状态为已取消
      await queryRunner.manager.update(Order, orderIds, {
        status: OrderStatus.CANCELLED,
        cancelledAt: new Date(),
      });

      // 恢复库存
      for (const order of expiredOrders) {
        await queryRunner.manager.update(
          Product,
          { id: order.productId },
          { stock: () => `stock + ${order.quantity}` },
        );
      }

      // 提交事务
      await queryRunner.commitTransaction();

      this.logger.log(
        `Successfully cancelled ${expiredOrders.length} expired orders and restored stock: ${expiredOrders
          .map((o) => `${o.id}(qty:${o.quantity})`)
          .join(', ')}`,
      );
    } catch (error) {
      // 回滚事务
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to cancel expired orders', error);
    } finally {
      // 释放连接
      await queryRunner.release();
    }
  }
}
