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

import { Affiliate } from '@/entities/affiliate.entity';
import { Logger } from '@nestjs/common';
import { CommonOrderService } from '@/modules/_common/order/order.service';

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
    where = {},
    customerId,
    affiliateId,
  }: {
    skip?: number;
    take?: number;
    where?: OrderWhereInput;
    customerId?: string;
    affiliateId?: string;
  }): Promise<OrderPagination> {
    const [items, total] = await this.orderRepository.findAndCount({
      where: {
        ...where,
        customerId,
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
      customerId?: string;
      affiliateId?: string;
    },
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id,
        customerId: where?.customerId,
        affiliateId: where?.affiliateId,
      },
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
      if (product.stock < data.quantity) {
        throw new BadRequestException(
          `库存不足，当前库存：${product.stock}，需要：${data.quantity}`,
        );
      }

      const merchant = await queryRunner.manager.findOne(Merchant, {
        where: { id: product.merchantId },
      });

      if (!merchant) {
        throw new NotFoundException(`Merchant ${product.merchantId} not found`);
      }

      const affiliate = await queryRunner.manager.findOne(Affiliate, {
        where: { id: data.affiliateId },
      });

      // 如果推广者为空，默认为招商经理
      if (!data.affiliateId || !affiliate) {
        data.affiliateId = merchant.affiliateId;
      }

      // 订单金额 = 订单数量 * 产品价格
      const amount = Math.floor(data.quantity * product.price * 100) / 100;

      // 总佣金
      const commissionAmount =
        Math.floor(data.quantity * product.commission * 100) / 100;

      // 平台佣金 = 订单金额 * 平台费用比例
      const platformAmount =
        Math.floor(data.quantity * (product.platformCommission || 0) * 100) /
        100;

      // 招商经理佣金 = 订单金额 * 招商经理佣金比例
      const merchantAffiliateAmount =
        Math.floor(
          data.quantity * (product.merchantAffiliateCommission || 0) * 100,
        ) / 100;

      // 推广者佣金 = 总佣金 - 平台佣金 - 招商经理佣金
      const affiliateAmount =
        Math.floor(data.quantity * (product.affiliateCommission || 0) * 100) /
        100;

      // 商家收入 = 订单金额 - 佣金金额
      const merchantAmount = amount - commissionAmount;

      const order = queryRunner.manager.create(Order, {
        customerId: customerId,
        affiliateId: data.affiliateId,
        amount,
        platformAmount,
        affiliateAmount,
        merchantAmount,
        merchantAffiliateAmount,
        status: OrderStatus.CREATED,
        note: data.note,
        productId: data.productId,
        merchantId: product.merchantId,
        receiverName: data.receiverName,
        receiverPhone: data.receiverPhone,
        merchantAffiliateId: merchant.affiliateId,
        quantity: data.quantity,
        productTitle: product.title,
        productImage: product.image,
        productContent: product.content,
        productPrice: product.price,
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
