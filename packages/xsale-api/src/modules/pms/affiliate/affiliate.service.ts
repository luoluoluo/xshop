import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Affiliate } from '@/entities/affiliate.entity';
import { MerchantAffiliate } from '@/entities/merchant-affiliate.entity';
import {
  CreateAffiliateInput,
  AffiliatePagination,
  AffiliateWhereInput,
} from './affiliate.dto';

@Injectable()
export class AffiliateService {
  private readonly logger = new Logger(AffiliateService.name);

  constructor(
    @InjectRepository(Affiliate)
    private affiliateRepository: Repository<Affiliate>,
    @InjectRepository(MerchantAffiliate)
    private merchantAffiliateRepository: Repository<MerchantAffiliate>,
  ) {}

  // Affiliate management methods
  async findAll({
    skip,
    take,
    where = {},
  }: {
    skip?: number;
    take?: number;
    where?: AffiliateWhereInput & {
      merchantAffiliates?: { merchant: { id: string } };
    };
  }): Promise<AffiliatePagination> {
    // 构建查询条件
    const whereCondition: FindOptionsWhere<Affiliate> = {
      ...where,
    };
    if (where.merchantAffiliates) {
      whereCondition.merchantAffiliates = {
        merchant: {
          id: where.merchantAffiliates.merchant.id,
        },
      };
    }

    const [items, total] = await this.affiliateRepository.findAndCount({
      where: whereCondition,
      skip,
      take,
      relations: {
        merchantAffiliates: {
          merchant: true,
        },
      },
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(id: string): Promise<Affiliate> {
    const affiliate = await this.affiliateRepository.findOne({
      where: { id },
      relations: {
        merchantAffiliates: {
          merchant: true,
        },
      },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    return affiliate;
  }

  async findByPhone(phone: string): Promise<Affiliate | null> {
    return await this.affiliateRepository.findOne({
      where: { phone },
      relations: ['wechatOAuth'],
    });
  }

  async create(
    createAffiliateInput: CreateAffiliateInput & {
      merchantAffiliate?: {
        merchantId: string;
      };
    },
  ): Promise<Affiliate> {
    let affiliate = await this.affiliateRepository.findOne({
      where: { phone: createAffiliateInput.phone },
    });
    if (!affiliate) {
      affiliate = this.affiliateRepository.create(createAffiliateInput);
      affiliate = await this.affiliateRepository.save(affiliate);
    }

    if (createAffiliateInput.merchantAffiliate) {
      const merchantAffiliate = this.merchantAffiliateRepository.create({
        affiliateId: affiliate.id,
        merchantId: createAffiliateInput.merchantAffiliate.merchantId,
      });
      await this.merchantAffiliateRepository.save(merchantAffiliate);
    }
    return this.findOne(affiliate.id);
  }

  async delete(id: string): Promise<boolean> {
    // 删除关联关系
    await this.merchantAffiliateRepository.delete({ affiliateId: id });

    await this.affiliateRepository.delete(id);
    return true;
  }
}
