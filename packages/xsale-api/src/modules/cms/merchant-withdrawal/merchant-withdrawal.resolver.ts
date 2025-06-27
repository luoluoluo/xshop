import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MerchantWithdrawal } from '@/entities/merchant-withdrawal.entity';
import {
  MerchantWithdrawalWhereInput,
  MerchantWithdrawalPagination,
} from './merchant-withdrawal.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { MerchantWithdrawalService } from './merchant-withdrawal.service';
import { UseGuards } from '@nestjs/common';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Resolver(() => MerchantWithdrawal)
export class MerchantWithdrawalResolver {
  constructor(private readonly withdrawalService: MerchantWithdrawalService) {}

  @Query(() => MerchantWithdrawalPagination)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('merchantWithdrawal.list')
  async merchantWithdrawals(
    @Args('where', { nullable: true }) where: MerchantWithdrawalWhereInput,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
  ): Promise<MerchantWithdrawalPagination> {
    return this.withdrawalService.findAll({
      where,
      skip,
      take,
    });
  }

  @Query(() => MerchantWithdrawal)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('merchantWithdrawal.show')
  async merchantWithdrawal(
    @Args('id') id: string,
  ): Promise<MerchantWithdrawal> {
    return this.withdrawalService.findOne(id);
  }

  @Mutation(() => MerchantWithdrawal)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('merchantWithdrawal.approve')
  async approveMerchantWithdrawal(
    @Args('id', { type: () => String }) id: string,
  ): Promise<MerchantWithdrawal> {
    return this.withdrawalService.approve(id);
  }

  @Mutation(() => MerchantWithdrawal)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('merchantWithdrawal.reject')
  async rejectMerchantWithdrawal(
    @Args('id', { type: () => String }) id: string,
    @Args('rejectReason', { type: () => String }) rejectReason: string,
  ): Promise<MerchantWithdrawal> {
    return this.withdrawalService.reject(id, rejectReason);
  }

  @Mutation(() => MerchantWithdrawal)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('merchantWithdrawal.complete')
  async completeMerchantWithdrawal(
    @Args('id', { type: () => String }) id: string,
  ): Promise<MerchantWithdrawal> {
    return this.withdrawalService.complete(id);
  }
}
