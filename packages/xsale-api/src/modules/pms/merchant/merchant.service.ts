import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { Merchant } from '@/entities/merchant.entity';
import { Role } from '@/entities/role.entity';
import { UpdateMeInput } from '../auth/auth.dto';

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findOne(id: string): Promise<Merchant> {
    const merchant = await this.merchantRepository.findOne({
      where: { id },
    });

    if (!merchant) {
      throw new NotFoundException('商户未找到');
    }

    return { ...merchant, password: '' };
  }

  async findByPhone(phone: string): Promise<Merchant | null> {
    return await this.merchantRepository.findOne({
      where: { phone },
    });
  }

  async update(
    id: string,
    updateMerchantDto: UpdateMeInput,
  ): Promise<Merchant> {
    const merchant = await this.findOne(id);

    try {
      if (updateMerchantDto.password) {
        const hashedPassword: string = await hash(
          updateMerchantDto.password,
          10,
        );
        updateMerchantDto.password = hashedPassword;
      }

      if (
        updateMerchantDto.phone &&
        updateMerchantDto.phone !== merchant.phone
      ) {
        const existingMerchant = await this.findByPhone(
          updateMerchantDto.phone,
        );
        if (existingMerchant) {
          throw new ConflictException('该手机号已注册');
        }
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

  async validateMerchant(
    phone: string,
    password: string,
  ): Promise<Merchant | null> {
    try {
      const merchant = await this.findByPhone(phone);
      if (!merchant) return null;
      const isPasswordValid = await compare(password, merchant?.password || '');
      if (!isPasswordValid) return null;

      const { password: _, ...result } = merchant;
      return result as Merchant;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to validate merchant');
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.merchantRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`商户ID ${id} 未找到`);
    }
    return true;
  }
}
