import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortLink } from '@/entities/short-link.entity';

@Injectable()
export class ShortLinkService {
  constructor(
    @InjectRepository(ShortLink)
    private readonly shortLinkRepository: Repository<ShortLink>,
  ) {}

  async findOne(id: string): Promise<ShortLink> {
    const shortLink = await this.shortLinkRepository.findOne({
      where: { id },
    });

    if (!shortLink) {
      throw new NotFoundException('Short link not found');
    }

    return shortLink;
  }

  async create(data: { url: string }): Promise<ShortLink> {
    const shortLink = this.shortLinkRepository.create(data);
    return this.shortLinkRepository.save(shortLink);
  }
}
