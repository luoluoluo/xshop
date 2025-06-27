import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { MerchantService } from './merchant.service';
import { Merchant } from '@/entities/merchant.entity';
import { MerchantWhereInput, MerchantPagination } from './merchant.dto';

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
    @Args('affiliateId', { type: () => String, nullable: true })
    affiliateId?: string,
  ): Promise<MerchantPagination> {
    const res = await this.merchantService.findAll({
      where,
      skip,
      take,
    });
    if (affiliateId) {
      try {
        const affiliate = await this.affiliateService.findOne(affiliateId);
        res.data.map((m) => {
          m.affiliate = affiliate;
          return m;
        });
      } catch (error) {
        console.log(error);
      }
    }
    return res;
  }

  @Query(() => Merchant)
  async merchant(
    @Args('id', { type: () => String }) id: string,
    @Args('affiliateId', { type: () => String, nullable: true })
    affiliateId?: string,
  ): Promise<Merchant> {
    const merchant = await this.merchantService.findOne(id);
    if (affiliateId) {
      try {
        const affiliate = await this.affiliateService.findOne(affiliateId);
        merchant.affiliate = affiliate;
      } catch (error) {
        console.log(error);
      }
    }
    return merchant;
  }
}
