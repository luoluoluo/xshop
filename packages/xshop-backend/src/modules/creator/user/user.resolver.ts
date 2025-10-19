import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { User } from '@/entities/user.entity';
import { UserService } from './user.service';
import { UserAuthGuard } from '@/modules/_common/auth/guards/user-auth.guard';
import { StoreContext } from '@/types/graphql-context';
import { CreateUserWechatMerchantInput, UpdateMeInput } from './user.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(UserAuthGuard)
  me(@Context() ctx: StoreContext): User {
    return ctx.req.user!;
  }

  @Mutation(() => User)
  @UseGuards(UserAuthGuard)
  async updateMe(
    @Args('data') data: UpdateMeInput,
    @Context() ctx: StoreContext,
  ): Promise<User> {
    return this.userService.update(ctx.req.user!.id, data);
  }

  @Mutation(() => User)
  @UseGuards(UserAuthGuard)
  async updateMeWechatOAuth(
    @Args('code') code: string,
    @Context() ctx: StoreContext,
  ): Promise<User> {
    return this.userService.updateWechatOAuth(ctx.req.user!.id, code);
  }

  @Mutation(() => User)
  @UseGuards(UserAuthGuard)
  async createUserWechatMerchant(
    @Args('data') data: CreateUserWechatMerchantInput,
    @Context() ctx: StoreContext,
  ): Promise<User> {
    return this.userService.createUserWechatMerchant(ctx.req.user!.id, data);
  }
}
