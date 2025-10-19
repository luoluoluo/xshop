import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from '@/entities/user.entity';
import { UserService } from './user.service';
import { UserAuthGuard } from '@/modules/_common/auth/guards/user-auth.guard';
import { CreateUserWechatMerchantInput, UpdateMeInput } from './user.dto';
import { UserSession } from '@/modules/_common/auth/decorators/user-session.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(UserAuthGuard)
  me(@UserSession() user: User): User {
    return user;
  }

  @Mutation(() => User)
  @UseGuards(UserAuthGuard)
  async updateMe(
    @Args('data') data: UpdateMeInput,
    @UserSession() user: User,
  ): Promise<User> {
    return this.userService.update(user.id, data);
  }

  @Mutation(() => User)
  @UseGuards(UserAuthGuard)
  async updateMeWechatOAuth(
    @Args('code') code: string,
    @UserSession() user: User,
  ): Promise<User> {
    return this.userService.updateWechatOAuth(user.id, code);
  }

  @Mutation(() => User)
  @UseGuards(UserAuthGuard)
  async createUserWechatMerchant(
    @Args('data') data: CreateUserWechatMerchantInput,
    @UserSession() user: User,
  ): Promise<User> {
    return this.userService.createUserWechatMerchant(user.id, data);
  }
}
