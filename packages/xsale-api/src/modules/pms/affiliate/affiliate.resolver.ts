import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { AffiliateService } from './affiliate.service';
import { Affiliate } from '@/entities/affiliate.entity';
import {
  AffiliateWhereInput,
  AffiliatePagination,
  CreateAffiliateInput,
} from './affiliate.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PmsContext } from '@/types/graphql-context';

@Resolver(() => Affiliate)
@UseGuards(GqlAuthGuard)
export class AffiliateResolver {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Query(() => AffiliatePagination)
  @UseGuards(GqlAuthGuard)
  async affiliates(
    @Args('where', { nullable: true }) where: AffiliateWhereInput,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
  ): Promise<AffiliatePagination> {
    return this.affiliateService.findAll({
      where,
      skip,
      take,
    });
  }

  @Query(() => Affiliate)
  async affiliate(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Affiliate> {
    return this.affiliateService.findOne(id);
  }

  @Mutation(() => Affiliate)
  @UseGuards(GqlAuthGuard)
  async createAffiliate(
    @Args('data') data: CreateAffiliateInput,
    @Context() ctx: PmsContext,
  ): Promise<Affiliate> {
    if (!ctx.req.user?.id) {
      throw new ForbiddenException('User not found');
    }
    return this.affiliateService.create({
      ...data,
      merchantAffiliate: {
        merchantId: ctx.req.user?.id,
      },
    });
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteAffiliate(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.affiliateService.delete(id);
  }
}
