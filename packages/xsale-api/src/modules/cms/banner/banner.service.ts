import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from '@/entities/banner.entity';
import {
  CreateBannerInput,
  BannerPagination,
  UpdateBannerInput,
  BannerWhereInput,
} from './banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  async findAll({
    skip,
    take,
    where = {},
  }: {
    skip?: number;
    take?: number;
    where?: BannerWhereInput;
  }): Promise<BannerPagination> {
    const [data, total] = await this.bannerRepository.findAndCount({
      where,
      skip,
      take,
      order: { sort: 'ASC' },
      relations: {
        merchant: true,
      },
    });
    return { data, total };
  }

  async findOne(id: string): Promise<Banner> {
    const banner = await this.bannerRepository.findOne({
      where: { id },
      relations: {
        merchant: true,
      },
    });
    if (!banner) {
      throw new NotFoundException(`Banner ${id} not found`);
    }
    return banner;
  }

  async create(data: CreateBannerInput): Promise<Banner> {
    console.log(data);
    try {
      const banner = this.bannerRepository.create(data);
      return await this.bannerRepository.save(banner);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Failed to create banner');
    }
  }

  async update(id: string, data: UpdateBannerInput): Promise<Banner> {
    const banner = await this.findOne(id);
    Object.assign(banner, data);
    try {
      return await this.bannerRepository.save(banner);
    } catch (err) {
      throw new InternalServerErrorException('Failed to update banner');
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.bannerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Banner ${id} not found`);
    }
    return true;
  }
}
