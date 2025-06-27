import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Banner } from '@/entities/banner.entity';
import { BannerService } from './banner.service';
import { BannerPagination, BannerWhereInput } from './banner.dto';

@Resolver(() => Banner)
export class BannerResolver {
  constructor(private readonly bannerService: BannerService) {}

  @Query(() => BannerPagination)
  async banners(
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => BannerWhereInput, nullable: true })
    where: BannerWhereInput,
  ): Promise<BannerPagination> {
    return await this.bannerService.findAll({
      skip,
      take,
      where,
    });
  }
}
