import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, ILike, Repository } from 'typeorm';
import { Link } from '@/entities/link.entity';
import {
  CreateLinkInput,
  LinkPagination,
  LinkWhereInput,
  UpdateLinkInput,
} from './link.dto';
import { SorterInput } from '@/types/sorter';

@Injectable()
export class LinkService {
  private readonly logger = new Logger(LinkService.name);

  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  async findAll({
    skip,
    take,
    where,
    sorters,
  }: {
    skip?: number;
    take?: number;
    where?: LinkWhereInput;
    sorters?: SorterInput[];
  }): Promise<LinkPagination> {
    const order: FindOptionsOrder<Link> = {};
    if (sorters?.length) {
      sorters.forEach((sorter) => {
        order[sorter.field] = sorter.direction;
      });
    } else {
      order.sort = 'asc';
    }

    const [items, total] = await this.linkRepository.findAndCount({
      where: {
        userId: where?.userId,
        name: where?.name ? ILike(`%${where?.name}%`) : undefined,
        id: where?.id,
      },
      skip,
      take,
      order,
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(id: string): Promise<Link> {
    const link = await this.linkRepository.findOne({
      where: { id },
    });
    if (!link) {
      throw new NotFoundException(`链接ID ${id} 未找到`);
    }
    return link;
  }

  async create(
    createLinkDto: CreateLinkInput & { userId?: string },
  ): Promise<Link> {
    try {
      const link = this.linkRepository.create({
        ...createLinkDto,
      });
      return this.linkRepository.save(link);
    } catch (err) {
      this.logger.error(`创建链接失败`, {
        error: err,
        createDto: createLinkDto,
      });
      throw new InternalServerErrorException('创建链接失败');
    }
  }

  async update(
    id: string,
    updateLinkDto: UpdateLinkInput,
    userId?: string,
  ): Promise<Link> {
    const link = await this.linkRepository.findOne({
      where: { id, userId },
    });
    if (!link) {
      throw new NotFoundException(`链接ID ${id} 未找到`);
    }

    try {
      Object.assign(link, updateLinkDto);
      return this.linkRepository.save(link);
    } catch (err) {
      this.logger.error(`更新链接失败`, {
        error: err,
        linkId: id,
        updateDto: updateLinkDto,
      });
      throw new InternalServerErrorException('更新链接失败');
    }
  }

  async delete(id: string, userId?: string): Promise<boolean> {
    const result = await this.linkRepository.delete({
      id,
      userId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`链接ID ${id} 未找到`);
    }
    return true;
  }
}
