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
import { SmsService } from '@/modules/_common/sms/sms.service';
import { ShortLinkService } from '@/modules/_common/short-link/short-link.service';
import { CommonJwtService } from '@/modules/_common/jwt/jtw.servive';

@Injectable()
export class AffiliateService {
  private readonly logger = new Logger(AffiliateService.name);

  constructor(
    @InjectRepository(Affiliate)
    private affiliateRepository: Repository<Affiliate>,
    @InjectRepository(MerchantAffiliate)
    private merchantAffiliateRepository: Repository<MerchantAffiliate>,
    private readonly smsService: SmsService,
    private readonly shortLinkService: ShortLinkService,
    private readonly commonJwtService: CommonJwtService,
  ) {}

  // Affiliate management methods
  async findAll({
    skip,
    take,
    where = {},
    merchant,
  }: {
    skip?: number;
    take?: number;
    where?: AffiliateWhereInput;
    merchant?: { id?: string };
  }): Promise<AffiliatePagination> {
    // 构建查询条件
    const whereCondition: FindOptionsWhere<Affiliate> = {
      id: where.id,
      name: where.name,
    };
    if (merchant?.id) {
      whereCondition.merchantAffiliates = {
        merchantId: merchant.id,
      };
    }

    const [items, total] = await this.affiliateRepository.findAndCount({
      where: whereCondition,
      skip,
      take,
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(id: string, merchantId?: string): Promise<Affiliate> {
    const affiliate = await this.affiliateRepository.findOne({
      where: { id, merchantAffiliates: { merchantId } },
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
    createAffiliateInput: CreateAffiliateInput,
    merchant?: { id?: string; name?: string },
  ): Promise<Affiliate> {
    let affiliate = await this.affiliateRepository.findOne({
      where: { phone: createAffiliateInput.phone },
    });
    if (!affiliate) {
      affiliate = this.affiliateRepository.create(createAffiliateInput);
      affiliate = await this.affiliateRepository.save(affiliate);
    }

    if (merchant?.id) {
      const merchantAffiliate = this.merchantAffiliateRepository.create({
        affiliateId: affiliate.id,
        merchantId: merchant.id,
      });
      await this.merchantAffiliateRepository.save(merchantAffiliate);
    }
    const token = this.commonJwtService.sign(affiliate.id);
    const url = `https://xltzx.com/app-crm?token=${token}`;
    const shortLink = await this.shortLinkService.create({
      url,
    });

    await this.smsService.sendInvite(createAffiliateInput.phone, {
      mch: merchant?.name || merchant?.id || '',
      uid: shortLink.id,
    });
    return this.findOne(affiliate.id);
  }

  async delete(id: string, merchantId?: string): Promise<boolean> {
    // 删除关联关系
    await this.merchantAffiliateRepository.delete({
      affiliateId: id,
      merchantId,
    });
    return true;
  }
}
