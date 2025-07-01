import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Affiliate } from '@/entities/affiliate.entity';
import { UpdateMeInput } from '../auth/auth.dto';

@Injectable()
export class AffiliateService {
  constructor(
    @InjectRepository(Affiliate)
    private readonly affiliateRepository: Repository<Affiliate>,
  ) {}

  async findOne(id: string): Promise<Affiliate> {
    const affiliate = await this.affiliateRepository.findOne({
      where: { id },
    });

    if (!affiliate) {
      throw new NotFoundException('商户未找到');
    }

    return affiliate;
  }

  async findByPhone(phone: string): Promise<Affiliate | null> {
    return await this.affiliateRepository.findOne({
      where: { phone },
    });
  }

  async create(affiliateData: {
    phone: string;
    name: string;
  }): Promise<Affiliate> {
    // 检查手机号是否已存在
    const existingAffiliate = await this.findByPhone(affiliateData.phone);
    if (existingAffiliate) {
      throw new ConflictException('该手机号已注册');
    }

    try {
      const affiliate = this.affiliateRepository.create({
        ...affiliateData,
      });

      const savedAffiliate = await this.affiliateRepository.save(affiliate);
      return savedAffiliate;
    } catch (err) {
      console.error('Failed to create affiliate:', err);
      throw new InternalServerErrorException('创建推广员失败');
    }
  }

  async updateMe(
    id: string,
    updateAffiliateDto: UpdateMeInput,
  ): Promise<Affiliate> {
    const affiliate = await this.findOne(id);

    try {
      Object.assign(affiliate, updateAffiliateDto);
      return this.affiliateRepository.save(affiliate);
    } catch (err) {
      if (err instanceof ConflictException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to update affiliate');
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.affiliateRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`商户ID ${id} 未找到`);
    }
    return true;
  }
}
