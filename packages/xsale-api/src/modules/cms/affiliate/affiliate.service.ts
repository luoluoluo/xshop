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

      return this.affiliateRepository.save(affiliate);
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
      return this.affiliateRepository.save(affiliate);
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
    await this.affiliateRepository.remove(affiliate);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    await this.affiliateRepository.delete(id);
    return true;
  }
}
