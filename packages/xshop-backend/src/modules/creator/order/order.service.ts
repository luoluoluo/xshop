import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, FindOptionsRelations } from 'typeorm';
import { Order } from '@/entities/order.entity';
import {
  CreateOrderInput,
  OrderPagination,
  OrderWhereInput,
} from './order.dto';
import { Product } from '@/entities/product.entity';

import { Logger } from '@nestjs/common';
import { CommonOrderService } from '@/modules/_common/order/order.service';
import { OrderStatus } from '@/types/order-status';
import { User } from '@/entities/user.entity';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
    private readonly commonOrderService: CommonOrderService,
  ) {}

  async findAll({
    skip,
    take,
    where,
    relations,
  }: {
    skip?: number;
    take?: number;
    where?: OrderWhereInput & {
      customerId?: string;
      merchantId?: string;
      affiliateId?: string;
    };
    relations?: FindOptionsRelations<Order>;
  }): Promise<OrderPagination> {
    const [items, total] = await this.orderRepository.findAndCount({
      where: {
        ...where,
      },
      skip,
      take,
      order: { createdAt: 'DESC' },
      relations,
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(
    id: string,
    options?: {
      where?: {
        customerId?: string;
        affiliateId?: string;
        merchantId?: string;
      };
      relations?: FindOptionsRelations<Order>;
    },
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id,
        customerId: options?.where?.customerId,
        affiliateId: options?.where?.affiliateId,
        merchantId: options?.where?.merchantId,
      },
      relations: options?.relations,
    });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return order;
  }

  async create(customerId: string, data: CreateOrderInput): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager.findOne(Product, {
        where: { id: data.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product ${data.productId} not found`);
      }

      // 检查库存是否充足
      if (product.stock <= data.quantity) {
        throw new BadRequestException(`库存不足`);
      }

      const merchant = await queryRunner.manager.findOne(User, {
        where: { id: product.userId },
      });

      if (!merchant) {
        throw new NotFoundException(`Creator ${product.userId} not found`);
      }

      // 订单金额
      const amount = product.price * data.quantity;

      // 佣金金额
      const affiliateAmount = product.commission * data.quantity;

      // 商家收入 = 订单金额 - 佣金金额
      const merchantAmount = amount - affiliateAmount;

      const order = queryRunner.manager.create(Order, {
        customerId: customerId,
        affiliateId: data.affiliateId || product.userId,
        quantity: data.quantity,
        amount,
        affiliateAmount,
        merchantAmount,
        status: OrderStatus.CREATED,
        note: data.note,
        productId: data.productId,
        merchantId: product.userId,
        receiverName: data.receiverName,
        receiverPhone: data.receiverPhone,
        productTitle: product.title,
        productImage: product.images?.[0],
        productDescription: product.description,
        productPrice: product.price,
        wechatMerchantId: merchant.wechatMerchantId,
      });

      const createdOrder = await queryRunner.manager.save(order);

      // 减库存
      await queryRunner.manager.update(
        Product,
        { id: data.productId },
        { stock: () => `stock - ${data.quantity}` },
      );

      // 提交事务
      await queryRunner.commitTransaction();

      return this.findOne(createdOrder.id);
    } catch (error) {
      this.logger.error(`创建订单失败`, {
        error,
        customerId,
        createOrderDto: data,
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
