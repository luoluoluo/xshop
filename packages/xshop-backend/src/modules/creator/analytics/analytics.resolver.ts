import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';
import { View } from '@/entities/view.entity';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreatorContext } from '@/types/graphql-context';
import { UseGuards } from '@nestjs/common';
import { AnalyticsStats, AnalyticsStatsWhereInput } from './analytics.dto';

@Resolver(() => View)
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Query(() => AnalyticsStats)
  @UseGuards(GqlAuthGuard)
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
}
