import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Withdrawal } from '@/entities/withdrawal.entity';
import { WithdrawalWhereInput, WithdrawalPagination } from './withdrawal.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { WithdrawalService } from './withdrawal.service';
import { UseGuards } from '@nestjs/common';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Resolver(() => Withdrawal)
export class WithdrawalResolver {
  constructor(private readonly withdrawalService: WithdrawalService) {}

  @Query(() => WithdrawalPagination)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('withdrawal.list')
  async withdrawals(
    @Args('where', { nullable: true }) where: WithdrawalWhereInput,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
  ): Promise<WithdrawalPagination> {
    return this.withdrawalService.findAll({
      where,
      skip,
      take,
    });
  }

  @Query(() => Withdrawal)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('withdrawal.show')
  async withdrawal(@Args('id') id: string): Promise<Withdrawal> {
    return this.withdrawalService.findOne(id);
  }

  @Mutation(() => Withdrawal)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('withdrawal.complete')
  async completeWithdrawal(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Withdrawal> {
    return this.withdrawalService.complete(id);
  }
}
