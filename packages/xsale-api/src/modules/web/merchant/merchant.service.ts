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
  }: {
    skip?: number;
    take?: number;
    where?: MerchantWhereInput;
  }): Promise<MerchantPagination> {
    const [items, total] = await this.merchantRepository.findAndCount({
      where,
      skip,
      take,
      relations: {
        affiliate: true,
      },
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(id: string, affiliateId?: string): Promise<Merchant> {
    const merchant = await this.merchantRepository.findOne({
      where: { id, affiliateId: affiliateId },
      relations: {
        affiliate: true,
      },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return merchant;
  }
}
