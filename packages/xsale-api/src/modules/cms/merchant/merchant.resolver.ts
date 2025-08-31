import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { Merchant } from '@/entities/merchant.entity';
import {
  MerchantWhereInput,
  MerchantPagination,
  CreateMerchantInput,
  ApproveWechatMerchantInput,
  RejectWechatMerchantInput,
  CompleteWechatMerchantInput,
} from './merchant.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { UpdateMerchantInput } from './merchant.dto';

@Resolver(() => Merchant)
@UseGuards(GqlAuthGuard)
export class MerchantResolver {
  constructor(private readonly merchantService: MerchantService) {}

  @Query(() => MerchantPagination)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('merchant.list')
  async merchants(
    @Args('where', { nullable: true }) where: MerchantWhereInput,
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
  ): Promise<MerchantPagination> {
    return this.merchantService.findAll({
      where,
      skip,
      take,
    });
  }

  @Query(() => Merchant)
  async merchant(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Merchant> {
    return this.merchantService.findOne(id);
  }

  @Mutation(() => Merchant)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('merchant.create')
  async createMerchant(
    @Args('data') data: CreateMerchantInput,
  ): Promise<Merchant> {
    return this.merchantService.create(data);
  }

  @Mutation(() => Merchant)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('merchant.update')
  async updateMerchant(
    @Args('id', { type: () => String }) id: string,
    @Args('data') data: UpdateMerchantInput,
  ): Promise<Merchant> {
    return this.merchantService.update(id, data);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('merchant.delete')
  async deleteMerchant(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.merchantService.delete(id);
  }

  @Mutation(() => Merchant)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('merchant.approve')
  async approveWechatMerchant(
    @Args('data') data: ApproveWechatMerchantInput,
  ): Promise<Merchant> {
    return this.merchantService.approveWechatMerchant(data);
  }

  @Mutation(() => Merchant)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('merchant.reject')
  async rejectWechatMerchant(
    @Args('data') data: RejectWechatMerchantInput,
  ): Promise<Merchant> {
    return this.merchantService.rejectWechatMerchant(data);
  }

  @Mutation(() => Merchant)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('merchant.complete')
  async completeWechatMerchant(
    @Args('data') data: CompleteWechatMerchantInput,
  ): Promise<Merchant> {
    return this.merchantService.completeWechatMerchant(data);
  }
}
