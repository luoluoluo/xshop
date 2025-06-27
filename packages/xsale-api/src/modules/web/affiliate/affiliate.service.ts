import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Affiliate } from '@/entities/affiliate.entity';
import { AffiliatePagination, AffiliateWhereInput } from './affiliate.dto';

@Injectable()
export class AffiliateService {
  constructor(
    @InjectRepository(Affiliate)
    private affiliateRepository: Repository<Affiliate>,
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
    const [items, total] = await this.affiliateRepository.findAndCount({
      where,
      skip,
      take,
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(id: string): Promise<Affiliate> {
    const affiliate = await this.affiliateRepository.findOne({
      where: { id },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    return affiliate;
  }
}
