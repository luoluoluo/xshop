import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from '@/entities/merchant.entity';
import { MerchantPagination, MerchantWhereInput } from './merchant.dto';

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(Merchant)
    private merchantRepository: Repository<Merchant>,
  ) {}

  // Merchant management methods
  async findAll({
    skip,
    take,
    where = {},
    affiliateId,
  }: {
    skip?: number;
    take?: number;
    where?: MerchantWhereInput;
    affiliateId?: string;
  }): Promise<MerchantPagination> {
    // 构建查询条件
    const whereCondition: any = {
      ...where,
    };

    // 如果指定了推广者ID，添加关联条件
    if (affiliateId) {
      whereCondition.merchantAffiliates = {
        affiliate: {
          id: affiliateId,
        },
      };
    }

    const [items, total] = await this.merchantRepository.findAndCount({
      where: whereCondition,
      skip,
      take,
      relations: {
        merchantAffiliates: {
          affiliate: true,
        },
      },
      order: { id: 'DESC' },
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(id: string, affiliateId?: string): Promise<Merchant> {
    const whereCondition: any = { id };

    if (affiliateId) {
      whereCondition.affiliateId = affiliateId;
    }

    const merchant = await this.merchantRepository.findOne({
      where: whereCondition,
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return merchant;
  }
}
