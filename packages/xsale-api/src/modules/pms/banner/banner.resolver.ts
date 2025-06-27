import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Banner } from '@/entities/banner.entity';
import { BannerService } from './banner.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import {
  BannerPagination,
  BannerWhereInput,
  CreateBannerInput,
  UpdateBannerInput,
} from './banner.dto';
import { PmsContext } from '@/types/graphql-context';

@Resolver(() => Banner)
export class BannerResolver {
  constructor(private readonly bannerService: BannerService) {}

  @Query(() => BannerPagination)
  @UseGuards(GqlAuthGuard)
  async banners(
    @Context() ctx: PmsContext,
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
  async banner(
    @Context() ctx: PmsContext,
    @Args('id') id: string,
  ): Promise<Banner> {
    return await this.bannerService.findOne(id, ctx.req.user?.id);
  }

  @Mutation(() => Banner)
  @UseGuards(GqlAuthGuard)
  async createBanner(
    @Context() ctx: PmsContext,
    @Args('data') data: CreateBannerInput,
  ): Promise<Banner> {
    return await this.bannerService.create(data, ctx.req.user?.id);
  }

  @Mutation(() => Banner)
  @UseGuards(GqlAuthGuard)
  async updateBanner(
    @Context() ctx: PmsContext,
    @Args('id') id: string,
    @Args('data') data: UpdateBannerInput,
  ): Promise<Banner> {
    return await this.bannerService.update(id, data, ctx.req.user?.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteBanner(
    @Context() ctx: PmsContext,
    @Args('id') id: string,
  ): Promise<boolean> {
    return await this.bannerService.delete(id, ctx.req.user?.id);
  }
}
