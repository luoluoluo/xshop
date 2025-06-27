import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Affiliate } from '@/entities/affiliate.entity';
import {
  CreateAffiliateInput,
  AffiliatePagination,
  AffiliateWhereInput,
  UpdateAffiliateInput,
} from './affiliate.dto';
import { hash } from 'bcrypt';

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

  async create(createAffiliateInput: CreateAffiliateInput): Promise<Affiliate> {
    const existingAffiliate = await this.affiliateRepository.findOne({
      where: { phone: createAffiliateInput.phone },
    });
    if (existingAffiliate) {
      throw new ConflictException('推广员已存在');
    }

    const password = await hash(createAffiliateInput.password, 10);
    const affiliate = this.affiliateRepository.create({
      ...createAffiliateInput,
      password,
    });

    return this.affiliateRepository.save(affiliate);
  }

  async update(
    id: string,
    updateAffiliateDto: UpdateAffiliateInput,
  ): Promise<Affiliate> {
    const affiliate = await this.findOne(id);
    if (updateAffiliateDto.password) {
      const password = await hash(updateAffiliateDto.password, 10);
      updateAffiliateDto.password = password;
    }

    if (
      updateAffiliateDto.phone &&
      updateAffiliateDto.phone !== affiliate.phone
    ) {
      const existingAffiliate = await this.affiliateRepository.findOne({
        where: { phone: updateAffiliateDto.phone },
      });
      if (existingAffiliate) {
        throw new ConflictException('推广员已存在');
      }
    }

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

  async remove(id: string): Promise<boolean> {
    const affiliate = await this.findOne(id);
    await this.affiliateRepository.remove(affiliate);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    await this.affiliateRepository.delete(id);
    return true;
  }
}
