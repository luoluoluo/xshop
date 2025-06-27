import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Banner } from '@/entities/banner.entity';
import { BannerPagination, BannerWhereInput } from './banner.dto';

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
      where: {
        ...where,
        isActive: true,
      },
      skip,
      take,
      order: { sort: 'ASC' },
    });
    return { data, total };
  }
}
