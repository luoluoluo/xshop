import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { WithdrawalService } from './withdrawal.service';
import { Withdrawal } from '@/entities/withdrawal.entity';

import {
  CreateWithdrawalInput,
  WithdrawalWhereInput,
  WithdrawalPagination,
} from './withdrawal.dto';
import { UserAuthGuard } from '@/modules/_common/auth/guards/user-auth.guard';
import { UserSession } from '@/modules/_common/auth/decorators/user-session.decorator';
import { User } from '@/entities/user.entity';

@Resolver(() => Withdrawal)
export class WithdrawalResolver {
  constructor(private readonly withdrawalService: WithdrawalService) {}

  @Mutation(() => Withdrawal)
  @UseGuards(UserAuthGuard)
  async createWithdrawal(
    @UserSession() user: User,
    @Args('data') data: CreateWithdrawalInput,
  ): Promise<Withdrawal> {
    return this.withdrawalService.create({
      ...data,
      userId: user.id,
    });
  }

  @Query(() => WithdrawalPagination)
  @UseGuards(UserAuthGuard)
  async withdrawals(
    @UserSession() user: User,
    @Args('where', { nullable: true }) where: WithdrawalWhereInput,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
  ): Promise<WithdrawalPagination> {
    return this.withdrawalService.findAll({
      where: {
        ...where,
        userId: user.id,
      },
      skip,
      take,
    });
  }

  @Query(() => Withdrawal)
  async withdrawal(
    @UserSession() user: User,
    @Args('id', { type: () => String }) id: string,
  ): Promise<Withdrawal> {
    return this.withdrawalService.findOne(id, {
      userId: user.id,
    });
  }
}
