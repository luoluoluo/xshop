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
  }: {
    skip?: number;
    take?: number;
    where?: OrderWhereInput & {
      affiliateId?: string;
    };
  }): Promise<OrderPagination> {
    const [items, total] = await this.orderRepository.findAndCount({
      where: {
        id: where?.id,
        merchantId: where?.merchantId,
        status: where?.status,
        affiliateId: where?.affiliateId,
      },
      skip,
      take,
      order: { createdAt: 'DESC' },
      relations: {
        merchant: true,
        customer: true,
        affiliate: true,
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
    },
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id,
        affiliateId: where?.affiliateId,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return order;
  }
}
