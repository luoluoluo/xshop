import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from '@/entities/order.entity';
import { OrderPagination, OrderWhereInput } from './order.dto';
import { User } from '@/entities/user.entity';
import { Merchant } from '@/entities/merchant.entity';
import { Logger } from '@nestjs/common';
import { CommonOrderService } from '@/modules/_common/order/order.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    private readonly dataSource: DataSource,
    private readonly commonOrderService: CommonOrderService,
  ) {}

  async findAll({
    skip,
    take,
    where = {},
    merchantId,
  }: {
    skip?: number;
    take?: number;
    where?: OrderWhereInput;
    merchantId?: string;
  }): Promise<OrderPagination> {
    const [data, total] = await this.orderRepository.findAndCount({
      where: {
        id: where?.id,
        status: where?.status,
        merchantId,
      },
      skip,
      take,
      order: { createdAt: 'DESC' },
      relations: {
        product: true,
        merchant: true,
        affiliate: true,
        customer: true,
        merchantAffiliate: true,
      },
    });

    return { data, total };
  }

  async findOne(id: string, merchantId?: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, merchantId },
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
