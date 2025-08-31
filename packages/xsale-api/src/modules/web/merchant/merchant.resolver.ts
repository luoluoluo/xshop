import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { MerchantService } from './merchant.service';
import { Merchant } from '@/entities/merchant.entity';
import { MerchantWhereInput, MerchantPagination } from './merchant.dto';

import { AffiliateService } from '../affiliate/affiliate.service';
import { Logger } from '@nestjs/common';

@Resolver(() => Merchant)
export class MerchantResolver {
  private readonly logger = new Logger(MerchantResolver.name);

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
    return await this.merchantService.findAll({
      where,
      skip,
      take,
    });
  }

  @Query(() => Merchant)
  async merchant(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Merchant> {
    return await this.merchantService.findOne(id);
  }
}
