import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from '@/entities/order.entity';
import { OrderPagination, OrderWhereInput } from './order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll({
    skip,
    take,
    where,
    affiliateId,
    merchantAffiliateId,
  }: {
    skip?: number;
    take?: number;
    where?: OrderWhereInput;
    affiliateId?: string;
    merchantAffiliateId?: string;
  }): Promise<OrderPagination> {
    const [items, total] = await this.orderRepository.findAndCount({
      where: {
        id: where?.id,
        merchantId: where?.merchantId,
        merchantAffiliateId,
        affiliateId,
        status: where?.status,
      },
      skip,
      take,
      order: { createdAt: 'DESC' },
      relations: {
        merchant: true,
        customer: true,
        affiliate: true,
        merchantAffiliate: true,
      },
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(
    id: string,
    where?: {
      affiliateId?: string;
      merchantAffiliateId?: string;
    },
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id,
        affiliateId: where?.affiliateId,
        merchantAffiliateId: where?.merchantAffiliateId,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return order;
  }
}
