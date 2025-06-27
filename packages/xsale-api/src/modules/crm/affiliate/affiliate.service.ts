import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { Affiliate } from '@/entities/affiliate.entity';
import { Role } from '@/entities/role.entity';
import { UpdateMeInput } from '../auth/auth.dto';

@Injectable()
export class AffiliateService {
  constructor(
    @InjectRepository(Affiliate)
    private readonly affiliateRepository: Repository<Affiliate>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findOne(id: string): Promise<Affiliate> {
    const affiliate = await this.affiliateRepository.findOne({
      where: { id },
    });

    if (!affiliate) {
      throw new NotFoundException('商户未找到');
    }

    return { ...affiliate, password: '' };
  }

  async findByPhone(phone: string): Promise<Affiliate | null> {
    return await this.affiliateRepository.findOne({
      where: { phone },
    });
  }

  async updateMe(
    id: string,
    updateAffiliateDto: UpdateMeInput,
  ): Promise<Affiliate> {
    const affiliate = await this.findOne(id);

    try {
      if (updateAffiliateDto.password) {
        const hashedPassword: string = await hash(
          updateAffiliateDto.password,
          10,
        );
        updateAffiliateDto.password = hashedPassword;
      }

      if (
        updateAffiliateDto.phone &&
        updateAffiliateDto.phone !== affiliate.phone
      ) {
        const existingAffiliate = await this.findByPhone(
          updateAffiliateDto.phone,
        );
        if (existingAffiliate) {
          throw new ConflictException('该手机号已注册');
        }
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

  async validateAffiliate(
    phone: string,
    password: string,
  ): Promise<Affiliate | null> {
    try {
      const affiliate = await this.findByPhone(phone);
      if (!affiliate) return null;
      const isPasswordValid = await compare(
        password,
        affiliate?.password || '',
      );
      if (!isPasswordValid) return null;

      const { password: _, ...result } = affiliate;
      return result as Affiliate;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to validate affiliate');
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
