import { Resolver, Query, Args, Context, Int } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';
import { View } from '@/entities/view.entity';
import { UserAuthGuard } from '@/modules/_common/auth/guards/user-auth.guard';
import { CreatorContext } from '@/types/graphql-context';
import { UseGuards } from '@nestjs/common';
import {
  AnalyticsStats,
  AnalyticsStatsWhereInput,
  ViewPagination,
  ViewWhereInput,
} from './analytics.dto';
import { SorterInput } from '@/types/sorter';

@Resolver(() => View)
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Query(() => AnalyticsStats)
  @UseGuards(UserAuthGuard)
  async getAnalyticsStats(
    @Args('where') where: AnalyticsStatsWhereInput,
    @Context() ctx: CreatorContext,
  ): Promise<AnalyticsStats> {
    const creatorId = ctx.req.user!.id;
    return await this.analyticsService.getAnalyticsStats(
      creatorId,
      where.startDate,
      where.endDate,
    );
  }

  @Query(() => ViewPagination)
  @UseGuards(UserAuthGuard)
  async views(
    @Context() ctx: CreatorContext,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => ViewWhereInput, nullable: true })
    where?: ViewWhereInput,
    @Args('sorters', { type: () => [SorterInput], nullable: true })
    sorters?: SorterInput[],
  ): Promise<ViewPagination> {
    const creatorId = ctx.req.user!.id;
    return await this.analyticsService.findAll({
      skip,
      take,
      where: {
        ...where,
        creatorId,
      },
      sorters,
    });
  }
}
