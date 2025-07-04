import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from '@/entities/merchant.entity';
import { UpdateMeInput } from '../auth/auth.dto';
import { Affiliate } from '@/entities/affiliate.entity';

@Injectable()
export class MerchantService {
  private readonly logger = new Logger(MerchantService.name);

  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    @InjectRepository(Affiliate)
    private readonly affiliateRepository: Repository<Affiliate>,
  ) {}

  async findOne(id: string): Promise<Merchant> {
    const merchant = await this.merchantRepository.findOne({
      where: { id },
    });

    if (!merchant) {
      throw new NotFoundException('商户未找到');
    }

    return merchant;
  }

  async findByPhone(phone: string): Promise<Merchant | null> {
    return await this.merchantRepository.findOne({
      where: { phone },
    });
  }

  async updateMe(
    id: string,
    updateMerchantDto: UpdateMeInput,
  ): Promise<Merchant> {
    const merchant = await this.findOne(id);

    try {
      Object.assign(merchant, updateMerchantDto);
      return this.merchantRepository.save(merchant);
    } catch (err) {
      this.logger.error(`更新商戶失敗`, {
        error: err,
        merchantId: id,
        updateDto: updateMerchantDto,
      });
      if (err instanceof ConflictException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to update merchant');
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.merchantRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`商户ID ${id} 未找到`);
    }
    return true;
  }

  async create(merchantData: {
    phone: string;
    name: string;
    description?: string;
    logo?: string;
    address?: string;
    businessScope?: string;
    wechatQrcode?: string;
    affiliateId: string;
  }): Promise<Merchant> {
    // 检查手机号是否已存在
    const existingMerchant = await this.findByPhone(merchantData.phone);
    if (existingMerchant) {
      throw new ConflictException('该手机号已注册');
    }

    const affiliate = await this.affiliateRepository.findOne({
      where: { id: merchantData.affiliateId },
    });
    if (!affiliate) {
      throw new NotFoundException('未找到推广者');
    }

    try {
      const merchant = this.merchantRepository.create({
        ...merchantData,
      });

      const savedMerchant = await this.merchantRepository.save(merchant);
      return savedMerchant;
    } catch (err) {
      this.logger.error(`創建商戶失敗`, {
        error: err,
        createDto: merchantData,
      });
      throw new InternalServerErrorException('创建商户失败');
    }
  }
}
