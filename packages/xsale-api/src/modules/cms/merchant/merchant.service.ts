import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from '@/entities/merchant.entity';
import {
  CreateMerchantInput,
  MerchantPagination,
  MerchantWhereInput,
  UpdateMerchantInput,
} from './merchant.dto';
import { hash } from 'bcrypt';

@Injectable()
export class MerchantService {
  private readonly logger = new Logger(MerchantService.name);

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

  async findOne(id: string): Promise<Merchant> {
    const merchant = await this.merchantRepository.findOne({
      where: { id },
      relations: {
        affiliate: true,
      },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return merchant;
  }

  async create(createMerchantInput: CreateMerchantInput): Promise<Merchant> {
    const existingMerchant = await this.merchantRepository.findOne({
      where: { phone: createMerchantInput.phone },
    });
    if (existingMerchant) {
      throw new ConflictException('商户已存在');
    }
    const merchant = this.merchantRepository.create(createMerchantInput);

    try {
      return this.merchantRepository.save(merchant);
    } catch (err) {
      this.logger.error('創建商戶失敗', {
        error: err,
        createMerchantDto: createMerchantInput,
      });
      throw new InternalServerErrorException('創建商戶失敗');
    }
  }

  async update(
    id: string,
    updateMerchantDto: UpdateMerchantInput,
  ): Promise<Merchant> {
    const merchant = await this.findOne(id);

    if (updateMerchantDto.phone && updateMerchantDto.phone !== merchant.phone) {
      const existingMerchant = await this.merchantRepository.findOne({
        where: { phone: updateMerchantDto.phone },
      });
      if (existingMerchant) {
        throw new ConflictException('商户已存在');
      }
    }

    try {
      Object.assign(merchant, updateMerchantDto);
      return this.merchantRepository.save(merchant);
    } catch (err) {
      if (err instanceof ConflictException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to update merchant');
    }
  }

  async remove(id: string): Promise<boolean> {
    const merchant = await this.findOne(id);
    await this.merchantRepository.remove(merchant);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    await this.merchantRepository.delete(id);
    return true;
  }
}
