import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { View } from '@/entities/view.entity';
import { Product } from '@/entities/product.entity';
import { User } from '@/entities/user.entity';
import { Order } from '@/entities/order.entity';
import { AnalyticsStats } from './analytics.dto';
import { OrderStatus } from '@/types/order-status';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectRepository(View)
    private readonly viewRepository: Repository<View>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getAnalyticsStats(
    creatorId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AnalyticsStats> {
    // Get PV (Page Views) - total views for creator's products/articles
    const pv = await this.viewRepository.count({
      where: {
        creatorId,
        createdAt: Between(startDate, endDate),
      },
    });

    // Get UV (Unique Visitors) - distinct IP addresses
    const uniqueViews = await this.viewRepository
      .createQueryBuilder('view')
      .select('DISTINCT view.ipAddress')
      .where('view.creatorId = :creatorId', { creatorId })
      .andWhere('view.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('view.ipAddress IS NOT NULL')
      .getRawMany();

    const uv = uniqueViews.length;

    // Get order count and amount for creator's products
    const orderStats = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.product', 'product')
      .select([
        'COUNT(order.id) as orderCount',
        'SUM(order.amount) as orderAmount',
      ])
      .where('product.userId = :creatorId', { creatorId })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('order.status IN (:...statuses)', {
        statuses: [OrderStatus.PAID, OrderStatus.COMPLETED],
      })
      .getRawOne();

    const orderCount = parseInt(orderStats?.orderCount || '0') || 0;
    const orderAmount = parseFloat(orderStats?.orderAmount || '0') || 0;

    return {
      pv,
      uv,
      orderCount,
      orderAmount,
    };
  }
}
