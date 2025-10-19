import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Withdrawal } from '@/entities/withdrawal.entity';
import { WithdrawalWhereInput, WithdrawalPagination } from './withdrawal.dto';
import { WithdrawalService } from './withdrawal.service';
import { UseGuards } from '@nestjs/common';
import { RequirePermission } from '@/modules/_common/auth/decorators/require-permission.decorator';
import { UserAuthGuard } from '@/modules/_common/auth/guards/user-auth.guard';

@Resolver(() => Withdrawal)
export class WithdrawalResolver {
  constructor(private readonly withdrawalService: WithdrawalService) {}

  @Query(() => WithdrawalPagination)
  @UseGuards(UserAuthGuard)
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
  @UseGuards(UserAuthGuard)
  @RequirePermission('withdrawal.show')
  async withdrawal(@Args('id') id: string): Promise<Withdrawal> {
    return this.withdrawalService.findOne(id);
  }

  @Mutation(() => Withdrawal)
  @UseGuards(UserAuthGuard)
  @RequirePermission('withdrawal.complete')
  async completeWithdrawal(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Withdrawal> {
    return this.withdrawalService.complete(id);
  }
}
