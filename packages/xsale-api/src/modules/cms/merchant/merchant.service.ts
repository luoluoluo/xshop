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
  ApproveWechatMerchantInput,
  RejectWechatMerchantInput,
  CompleteWechatMerchantInput,
} from './merchant.dto';
import { WechatMerchantStatus } from '@/types/merchant-wechat-status';
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
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(id: string): Promise<Merchant> {
    const merchant = await this.merchantRepository.findOne({
      where: { id },
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

    try {
      let password: string | undefined;
      if (createMerchantInput.password) {
        password = await hash(createMerchantInput.password, 10);
      }

      const merchant = this.merchantRepository.create({
        ...createMerchantInput,
        password,
      });

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
    const merchant = await this.merchantRepository.findOne({
      where: { id },
    });
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    if (updateMerchantDto.phone && updateMerchantDto.phone !== merchant.phone) {
      const existingMerchant = await this.merchantRepository.findOne({
        where: { phone: updateMerchantDto.phone },
      });
      if (existingMerchant) {
        throw new ConflictException('商户已存在');
      }
    }

    try {
      if (updateMerchantDto.password) {
        const hashedPassword = await hash(updateMerchantDto.password, 10);
        updateMerchantDto.password = hashedPassword;
      }

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
    const merchant = await this.merchantRepository.findOne({
      where: { id },
    });
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }
    await this.merchantRepository.remove(merchant);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    await this.merchantRepository.delete(id);
    return true;
  }

  async approveWechatMerchant(
    input: ApproveWechatMerchantInput,
  ): Promise<Merchant> {
    const merchant = await this.merchantRepository.findOne({
      where: { id: input.id },
    });

    if (!merchant) {
      throw new NotFoundException('商户未找到');
    }

    try {
      merchant.wechatMerchantSignUrl = input.wechatMerchantSignUrl;
      merchant.wechatMerchantStatus = WechatMerchantStatus.APPLIED;

      return await this.merchantRepository.save(merchant);
    } catch (err) {
      this.logger.error('通过微信商户申请失败', {
        error: err,
        merchantId: input.id,
        input,
      });
      throw new InternalServerErrorException('通过微信商户申请失败');
    }
  }

  async rejectWechatMerchant(
    input: RejectWechatMerchantInput,
  ): Promise<Merchant> {
    const merchant = await this.merchantRepository.findOne({
      where: { id: input.id },
    });

    if (!merchant) {
      throw new NotFoundException('商户未找到');
    }

    try {
      merchant.wechatMerchantNote = input.wechatMerchantNote;
      merchant.wechatMerchantStatus = WechatMerchantStatus.REJECTED;

      return await this.merchantRepository.save(merchant);
    } catch (err) {
      this.logger.error('拒绝微信商户申请失败', {
        error: err,
        merchantId: input.id,
        input,
      });
      throw new InternalServerErrorException('拒绝微信商户申请失败');
    }
  }

  async completeWechatMerchant(
    input: CompleteWechatMerchantInput,
  ): Promise<Merchant> {
    const merchant = await this.merchantRepository.findOne({
      where: { id: input.id },
    });

    if (!merchant) {
      throw new NotFoundException('商户未找到');
    }

    try {
      merchant.wechatMerchantId = input.wechatMerchantId;
      merchant.wechatMerchantStatus = WechatMerchantStatus.COMPLETED;

      return await this.merchantRepository.save(merchant);
    } catch (err) {
      this.logger.error('完成微信商户申请失败', {
        error: err,
        merchantId: input.id,
        input,
      });
      throw new InternalServerErrorException('完成微信商户申请失败');
    }
  }
}
