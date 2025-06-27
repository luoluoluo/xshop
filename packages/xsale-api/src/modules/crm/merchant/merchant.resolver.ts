import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { Merchant } from '@/entities/merchant.entity';
import { MerchantWhereInput, MerchantPagination } from './merchant.dto';

import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CrmContext } from '@/types/graphql-context';
import { AffiliateService } from '../affiliate/affiliate.service';

@Resolver(() => Merchant)
export class MerchantResolver {
  constructor(
    private readonly merchantService: MerchantService,
    private readonly affiliateService: AffiliateService,
  ) {}

  @Query(() => MerchantPagination)
  async merchants(
    @Args('where', { nullable: true }) where: MerchantWhereInput,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
  ): Promise<MerchantPagination> {
    return this.merchantService.findAll({
      where,
      skip,
      take,
    });
  }

  @Query(() => Merchant)
  async merchant(
    @Context() ctx: CrmContext,
    @Args('id', { type: () => String }) id: string,
    @Args('affiliateId', { type: () => String, nullable: true })
    affiliateId?: string,
  ): Promise<Merchant> {
    const merchant = await this.merchantService.findOne(id);
    if (affiliateId) {
      const affiliate = await this.affiliateService.findOne(affiliateId);
      merchant.affiliate = affiliate;
    }
    return merchant;
  }
}
