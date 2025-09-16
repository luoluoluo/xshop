import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { WithdrawalService } from './withdrawal.service';
import { Withdrawal } from '@/entities/withdrawal.entity';

import {
  CreateWithdrawalInput,
  WithdrawalWhereInput,
  WithdrawalPagination,
} from './withdrawal.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { StoreContext } from '@/types/graphql-context';

@Resolver(() => Withdrawal)
export class WithdrawalResolver {
  constructor(private readonly withdrawalService: WithdrawalService) {}

  @Mutation(() => Withdrawal)
  @UseGuards(GqlAuthGuard)
  async createWithdrawal(
    @Context() ctx: StoreContext,
    @Args('data') data: CreateWithdrawalInput,
  ): Promise<Withdrawal> {
    return this.withdrawalService.create({
      ...data,
      userId: ctx.req.user!.id,
    });
  }

  @Query(() => WithdrawalPagination)
  @UseGuards(GqlAuthGuard)
  async withdrawals(
    @Context() ctx: StoreContext,
    @Args('where', { nullable: true }) where: WithdrawalWhereInput,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
  ): Promise<WithdrawalPagination> {
    return this.withdrawalService.findAll({
      where: {
        ...where,
        userId: ctx.req.user!.id,
      },
      skip,
      take,
    });
  }

  @Query(() => Withdrawal)
  async withdrawal(
    @Context() ctx: StoreContext,
    @Args('id', { type: () => String }) id: string,
  ): Promise<Withdrawal> {
    return this.withdrawalService.findOne(id, {
      userId: ctx.req.user!.id,
    });
  }
}
