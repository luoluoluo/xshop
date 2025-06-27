import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AffiliateWithdrawalService } from './affiliate-withdrawal.service';
import { AffiliateWithdrawal } from '@/entities/affiliate-withdrawal.entity';

import {
  CreateAffiliateWithdrawalInput,
  AffiliateWithdrawalWhereInput,
  AffiliateWithdrawalPagination,
} from './affiliate-withdrawal.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CrmContext } from '@/types/graphql-context';

@Resolver(() => AffiliateWithdrawal)
export class AffiliateWithdrawalResolver {
  constructor(private readonly withdrawalService: AffiliateWithdrawalService) {}

  @Mutation(() => AffiliateWithdrawal)
  @UseGuards(GqlAuthGuard)
  async createAffiliateWithdrawal(
    @Context() ctx: CrmContext,
    @Args('createAffiliateWithdrawalInput')
    createAffiliateWithdrawalInput: CreateAffiliateWithdrawalInput,
  ): Promise<AffiliateWithdrawal> {
    return this.withdrawalService.create(
      createAffiliateWithdrawalInput,
      ctx.req.user!.id,
    );
  }

  @Query(() => AffiliateWithdrawalPagination)
  @UseGuards(GqlAuthGuard)
  async withdrawals(
    @Context() ctx: CrmContext,
    @Args('where', { nullable: true }) where: AffiliateWithdrawalWhereInput,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
  ): Promise<AffiliateWithdrawalPagination> {
    return this.withdrawalService.findAll({
      where,
      skip,
      take,
      affiliateId: ctx.req.user?.id,
    });
  }

  @Query(() => AffiliateWithdrawal)
  async withdrawal(
    @Context() ctx: CrmContext,
    @Args('id', { type: () => String }) id: string,
  ): Promise<AffiliateWithdrawal> {
    return this.withdrawalService.findOne(id, ctx.req.user!.id);
  }
}
