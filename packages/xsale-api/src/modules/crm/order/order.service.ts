import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from '@/entities/order.entity';
import {
  CreateOrderInput,
  OrderPagination,
  OrderWhereInput,
} from './order.dto';
import { Product } from '@/entities/product.entity';
import { Merchant } from '@/entities/merchant.entity';
import {
  MERCHANT_AFFILIATE_COMMISSION_PERCENTAGE,
  PLATFORM_FEE_PERCENTAGE,
} from '@/core/constants';

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
    where = {},
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
        ...where,
        merchantAffiliateId,
        affiliateId,
      },
      skip,
      take,
      order: { createdAt: 'DESC' },
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
