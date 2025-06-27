import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AffiliateWithdrawal } from '@/entities/affiliate-withdrawal.entity';
import {
  AffiliateWithdrawalWhereInput,
  AffiliateWithdrawalPagination,
} from './affiliate-withdrawal.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { AffiliateWithdrawalService } from './affiliate-withdrawal.service';
import { UseGuards } from '@nestjs/common';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Resolver(() => AffiliateWithdrawal)
export class AffiliateWithdrawalResolver {
  constructor(private readonly withdrawalService: AffiliateWithdrawalService) {}

  @Query(() => AffiliateWithdrawalPagination)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('affiliateWithdrawal.list')
  async affiliateWithdrawals(
    @Args('where', { nullable: true }) where: AffiliateWithdrawalWhereInput,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
  ): Promise<AffiliateWithdrawalPagination> {
    return this.withdrawalService.findAll({
      where,
      skip,
      take,
    });
  }

  @Query(() => AffiliateWithdrawal)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('affiliateWithdrawal.show')
  async affiliateWithdrawal(
    @Args('id') id: string,
  ): Promise<AffiliateWithdrawal> {
    return this.withdrawalService.findOne(id);
  }

  @Mutation(() => AffiliateWithdrawal)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('affiliateWithdrawal.approve')
  async approveAffiliateWithdrawal(
    @Args('id', { type: () => String }) id: string,
  ): Promise<AffiliateWithdrawal> {
    return this.withdrawalService.approve(id);
  }

  @Mutation(() => AffiliateWithdrawal)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('affiliateWithdrawal.reject')
  async rejectAffiliateWithdrawal(
    @Args('id', { type: () => String }) id: string,
    @Args('rejectReason', { type: () => String }) rejectReason: string,
  ): Promise<AffiliateWithdrawal> {
    return this.withdrawalService.reject(id, rejectReason);
  }

  @Mutation(() => AffiliateWithdrawal)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('affiliateWithdrawal.complete')
  async completeAffiliateWithdrawal(
    @Args('id', { type: () => String }) id: string,
  ): Promise<AffiliateWithdrawal> {
    return this.withdrawalService.complete(id);
  }
}
