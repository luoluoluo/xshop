import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';
import { View } from '@/entities/view.entity';
import { TrackViewInput } from './analytics.dto';
import { Req } from '@nestjs/common';
import { Request } from 'express';

@Resolver(() => View)
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Mutation(() => View)
  async trackView(
    @Req() request: Request,
    @Args('data') data: TrackViewInput,
  ): Promise<View> {
    return this.analyticsService.trackView(data, request);
  }

  @Query(() => Number)
  async getProductViews(@Args('productId') productId: string): Promise<number> {
    return this.analyticsService.getProductViews(productId);
  }

  @Query(() => Number)
  async getUserPageViews(@Args('userId') userId: string): Promise<number> {
    return this.analyticsService.getUserPageViews(userId);
  }
}
