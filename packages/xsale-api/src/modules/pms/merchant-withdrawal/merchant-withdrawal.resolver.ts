import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MerchantWithdrawalService } from './merchant-withdrawal.service';
import { MerchantWithdrawal } from '@/entities/merchant-withdrawal.entity';

import {
  CreateMerchantWithdrawalInput,
  MerchantWithdrawalWhereInput,
  MerchantWithdrawalPagination,
} from './merchant-withdrawal.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PmsContext } from '@/types/graphql-context';

@Resolver(() => MerchantWithdrawal)
export class MerchantWithdrawalResolver {
  constructor(private readonly withdrawalService: MerchantWithdrawalService) {}

  @Mutation(() => MerchantWithdrawal)
  @UseGuards(GqlAuthGuard)
  async createMerchantWithdrawal(
    @Context() ctx: PmsContext,
    @Args('data') data: CreateMerchantWithdrawalInput,
  ): Promise<MerchantWithdrawal> {
    return this.withdrawalService.create(data, ctx.req.user!.id);
  }

  @Query(() => MerchantWithdrawalPagination)
  @UseGuards(GqlAuthGuard)
  async merchantWithdrawals(
    @Context() ctx: PmsContext,
    @Args('where', { nullable: true }) where: MerchantWithdrawalWhereInput,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
  ): Promise<MerchantWithdrawalPagination> {
    return this.withdrawalService.findAll({
      where,
      skip,
      take,
      merchantId: ctx.req.user!.id,
    });
  }

  @Query(() => MerchantWithdrawal)
  async merchantWithdrawal(
    @Context() ctx: PmsContext,
    @Args('id', { type: () => String }) id: string,
  ): Promise<MerchantWithdrawal> {
    return this.withdrawalService.findOne(id, ctx.req.user!.id);
  }
}
