import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { User } from '@/entities/user.entity';
import { UserService } from './user.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { StoreContext } from '@/types/graphql-context';
import { CreateUserWechatMerchantInput, UpdateMeInput } from './user.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async user(@Args('id') id: string): Promise<User> {
    const user = await this.userService.findOne(id, {
      relations: {
        links: true,
        products: true,
      },
      order: {
        links: {
          sort: 'ASC',
        },
        products: {
          sort: 'ASC',
        },
      },
    });
    if (!user) {
      throw new NotFoundException(`用戶ID ${id} 未找到`);
    }
    return {
      ...user,
      wechatOpenId: undefined,
      balance: undefined,
      wechatMerchantId: undefined,
      bankAccountNumber: undefined,
      bankAccountName: undefined,
      businessLicensePhoto: undefined,
      idCardFrontPhoto: undefined,
      idCardBackPhoto: undefined,
      wechatMerchantStatus: undefined,
    };
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  me(@Context() ctx: StoreContext): User {
    return ctx.req.user!;
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateMe(
    @Args('data') data: UpdateMeInput,
    @Context() ctx: StoreContext,
  ): Promise<User> {
    return this.userService.update(ctx.req.user!.id, data);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateMeWechatOAuth(
    @Args('code') code: string,
    @Context() ctx: StoreContext,
  ): Promise<User> {
    return this.userService.updateWechatOAuth(ctx.req.user!.id, code);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async createUserWechatMerchant(
    @Args('data') data: CreateUserWechatMerchantInput,
    @Context() ctx: StoreContext,
  ): Promise<User> {
    return this.userService.createUserWechatMerchant(ctx.req.user!.id, data);
  }
}
