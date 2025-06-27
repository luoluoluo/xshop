import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@/entities/order.entity';
import { OrderPagination, OrderWhereInput } from './order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll({
    skip,
    take,
    where = {},
  }: {
    skip?: number;
    take?: number;
    where?: OrderWhereInput;
  }): Promise<OrderPagination> {
    const [data, total] = await this.orderRepository.findAndCount({
      where,
      skip,
      take,
      order: { createdAt: 'DESC' },
      relations: {
        product: true,
        merchant: true,
        affiliate: true,
        customer: true,
      },
    });

    return { data, total };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        product: true,
        merchant: true,
        affiliate: true,
        customer: true,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }
}
