import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';
import { View } from '@/entities/view.entity';
import { TrackViewInput } from './analytics.dto';
import { StoreContext } from '@/types/graphql-context';

@Resolver(() => View)
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Mutation(() => View)
  async trackView(
    @Args('data') data: TrackViewInput,
    @Context() context: StoreContext,
  ): Promise<View> {
    return this.analyticsService.trackView(data, context.req);
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
