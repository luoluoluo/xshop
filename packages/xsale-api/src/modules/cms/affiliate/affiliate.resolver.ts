import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AffiliateService } from './affiliate.service';
import { Affiliate } from '@/entities/affiliate.entity';
import {
  AffiliateWhereInput,
  AffiliatePagination,
  CreateAffiliateInput,
} from './affiliate.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { UpdateAffiliateInput } from './affiliate.dto';

@Resolver(() => Affiliate)
@UseGuards(GqlAuthGuard)
export class AffiliateResolver {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Query(() => AffiliatePagination)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('affiliate.list')
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
  @RequirePermission('affiliate.create')
  async createAffiliate(
    @Args('data') data: CreateAffiliateInput,
  ): Promise<Affiliate> {
    return this.affiliateService.create(data);
  }

  @Mutation(() => Affiliate)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('affiliate.update')
  async updateAffiliate(
    @Args('id', { type: () => String }) id: string,
    @Args('data') data: UpdateAffiliateInput,
  ): Promise<Affiliate> {
    return this.affiliateService.update(id, data);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('affiliate.delete')
  async deleteAffiliate(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.affiliateService.delete(id);
  }
}
