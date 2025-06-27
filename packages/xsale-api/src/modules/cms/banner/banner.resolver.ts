import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Banner } from '@/entities/banner.entity';
import { BannerService } from './banner.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import {
  BannerPagination,
  BannerWhereInput,
  CreateBannerInput,
  UpdateBannerInput,
} from './banner.dto';

@Resolver(() => Banner)
export class BannerResolver {
  constructor(private readonly bannerService: BannerService) {}

  @Query(() => BannerPagination)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('banner.list')
  async banners(
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => BannerWhereInput, defaultValue: {} })
    where?: BannerWhereInput,
  ): Promise<BannerPagination> {
    return await this.bannerService.findAll({
      skip,
      take,
      where,
    });
  }

  @Query(() => Banner)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('banner.show')
  async banner(@Args('id') id: string): Promise<Banner> {
    return await this.bannerService.findOne(id);
  }

  @Mutation(() => Banner)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('banner.create')
  async createBanner(@Args('data') data: CreateBannerInput): Promise<Banner> {
    return await this.bannerService.create(data);
  }

  @Mutation(() => Banner)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('banner.edit')
  async updateBanner(
    @Args('id') id: string,
    @Args('data') data: UpdateBannerInput,
  ): Promise<Banner> {
    return await this.bannerService.update(id, data);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('banner.delete')
  async deleteBanner(@Args('id') id: string): Promise<boolean> {
    return await this.bannerService.delete(id);
  }
}
