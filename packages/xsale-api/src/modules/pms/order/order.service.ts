import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from '@/entities/order.entity';
import { OrderPagination, OrderWhereInput } from './order.dto';
import { User } from '@/entities/user.entity';
import { Merchant } from '@/entities/merchant.entity';
import { Affiliate } from '@/entities/affiliate.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    private readonly dataSource: DataSource,
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

  async complete(id: string, merchantId?: string): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {
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
      if (order.status !== OrderStatus.PAID) {
        throw new BadRequestException('只有已支付的订单才能完成');
      }

      const merchantAffiliate = await queryRunner.manager.findOne(Affiliate, {
        where: { id: order.merchantAffiliateId },
      });

      if (!merchantAffiliate) {
        throw new BadRequestException('商户客户经理不存在');
      }

      const affiliate = await queryRunner.manager.findOne(Affiliate, {
        where: { id: order.affiliateId },
      });
      if (!affiliate) {
        throw new BadRequestException('推广员不存在');
      }

      const merchant = await queryRunner.manager.findOne(Merchant, {
        where: { id: order.merchantId },
      });
      if (!merchant) {
        throw new BadRequestException('商户不存在');
      }

      // 更新订单状态
      order.status = OrderStatus.COMPLETED;
      order.completedAt = new Date();
      const savedOrder = await queryRunner.manager.save(order);

      // 检查推广员和招商经理是否是同一个人
      if (affiliate.id === merchantAffiliate.id) {
        // 同一个人，累加两个金额一次性更新
        affiliate.balance =
          Number(affiliate.balance) +
          Number(order.affiliateAmount || 0) +
          Number(order.merchantAffiliateAmount || 0);
        await queryRunner.manager.save(affiliate);
      } else {
        // 不同的人，分别更新余额
        // 更新推广员余额
        affiliate.balance =
          Number(affiliate.balance) + Number(order.affiliateAmount || 0);
        await queryRunner.manager.save(affiliate);

        // 更新商户客户经理余额
        merchantAffiliate.balance =
          Number(merchantAffiliate.balance) +
          Number(order.merchantAffiliateAmount || 0);
        await queryRunner.manager.save(merchantAffiliate);
      }

      if (order.merchantId) {
        // 更新商户余额
        merchant.balance =
          Number(merchant.balance) + Number(order.merchantAmount || 0);
        await queryRunner.manager.save(merchant);
      }
      // 提交事务
      await queryRunner.commitTransaction();

      return savedOrder;
    } catch (error) {
      // 回滚事务
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 释放连接
      await queryRunner.release();
    }
  }
}
