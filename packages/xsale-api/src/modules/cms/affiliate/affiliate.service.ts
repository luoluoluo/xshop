import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { Affiliate } from '@/entities/affiliate.entity';
import { MerchantAffiliate } from '@/entities/merchant-affiliate.entity';
import {
  CreateAffiliateInput,
  AffiliatePagination,
  AffiliateWhereInput,
  UpdateAffiliateInput,
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
    where?: AffiliateWhereInput;
  }): Promise<AffiliatePagination> {
    // 构建查询条件
    const whereCondition: any = {
      ...where,
    };

    // 如果指定了商家ID，添加关联条件
    if (where.merchantId) {
      whereCondition.merchantAffiliates = {
        merchant: {
          id: where.merchantId,
        },
      };
      // 删除merchantId，避免重复查询
      delete whereCondition.merchantId;
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

  async create(createAffiliateInput: CreateAffiliateInput): Promise<Affiliate> {
    const existingAffiliate = await this.affiliateRepository.findOne({
      where: { phone: createAffiliateInput.phone },
    });
    if (existingAffiliate) {
      throw new ConflictException('推广者已存在');
    }

    try {
      let password: string | undefined;
      if (createAffiliateInput.password) {
        password = await hash(createAffiliateInput.password, 10);
      }

      const affiliate = this.affiliateRepository.create({
        ...createAffiliateInput,
        password,
      });

      const savedAffiliate = await this.affiliateRepository.save(affiliate);

      // 处理商家关联
      if (
        createAffiliateInput.merchantIds &&
        createAffiliateInput.merchantIds.length > 0
      ) {
        const merchantAffiliates = createAffiliateInput.merchantIds.map(
          (merchantId) =>
            this.merchantAffiliateRepository.create({
              affiliateId: savedAffiliate.id,
              merchantId,
            }),
        );
        await this.merchantAffiliateRepository.save(merchantAffiliates);
      }

      return this.findOne(savedAffiliate.id);
    } catch (err) {
      this.logger.error('創建推廣員失敗', {
        error: err,
        createDto: createAffiliateInput,
      });
      throw new InternalServerErrorException('創建推廣員失敗');
    }
  }

  async update(
    id: string,
    updateAffiliateDto: UpdateAffiliateInput,
  ): Promise<Affiliate> {
    const affiliate = await this.affiliateRepository.findOne({
      where: { id },
    });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    if (
      updateAffiliateDto.phone &&
      updateAffiliateDto.phone !== affiliate.phone
    ) {
      const existingAffiliate = await this.affiliateRepository.findOne({
        where: { phone: updateAffiliateDto.phone },
      });
      if (existingAffiliate) {
        throw new ConflictException('推广者已存在');
      }
    }

    try {
      if (updateAffiliateDto.password) {
        const hashedPassword = await hash(updateAffiliateDto.password, 10);
        updateAffiliateDto.password = hashedPassword;
      }

      Object.assign(affiliate, updateAffiliateDto);
      const savedAffiliate = await this.affiliateRepository.save(affiliate);

      // 处理商家关联更新
      if (updateAffiliateDto.merchantIds !== undefined) {
        // 删除现有关联
        await this.merchantAffiliateRepository.delete({ affiliateId: id });

        // 创建新的关联
        if (updateAffiliateDto.merchantIds.length > 0) {
          const merchantAffiliates = updateAffiliateDto.merchantIds.map(
            (merchantId) =>
              this.merchantAffiliateRepository.create({
                affiliateId: id,
                merchantId,
              }),
          );
          await this.merchantAffiliateRepository.save(merchantAffiliates);
        }
      }

      return this.findOne(id);
    } catch (err) {
      if (err instanceof ConflictException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to update affiliate');
    }
  }

  async remove(id: string): Promise<boolean> {
    const affiliate = await this.affiliateRepository.findOne({
      where: { id },
    });
    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    // 删除关联关系
    await this.merchantAffiliateRepository.delete({ affiliateId: id });

    await this.affiliateRepository.remove(affiliate);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    // 删除关联关系
    await this.merchantAffiliateRepository.delete({ affiliateId: id });

    await this.affiliateRepository.delete(id);
    return true;
  }
}
