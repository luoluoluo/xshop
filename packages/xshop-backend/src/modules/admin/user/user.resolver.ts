import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from '@/entities/user.entity';
import { UserService } from './user.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import {
  CompleteUserWechatMerchantInput,
  CreateUserInput,
  UpdateUserInput,
  UserPagination,
  UserWhereInput,
} from './user.dto';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserPagination)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('user.list')
  async users(
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
    @Args('where', { type: () => UserWhereInput, defaultValue: {} })
    where?: UserWhereInput,
  ): Promise<UserPagination> {
    // const t = true;
    // if (t) {
    //   throw new BadRequestException('INSUFFICIENT_STOCK::Insufficient stock');
    // }
    return await this.userService.findAll({
      skip,
      take,
      where,
    });
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('user.show')
  async user(@Args('id') id: string): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('user.create')
  async createUser(@Args('data') data: CreateUserInput): Promise<User> {
    return await this.userService.create(data);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('user.edit')
  async updateUser(
    @Args('id') id: string,
    @Args('data') data: UpdateUserInput,
  ): Promise<User> {
    return await this.userService.update(id, data);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('user.delete')
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    return await this.userService.delete(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  @RequirePermission('user.completeUserWechatMerchant')
  async completeUserWechatMerchant(
    @Args('data') data: CompleteUserWechatMerchantInput,
  ): Promise<boolean> {
    return await this.userService.completeUserWechatMerchant(data);
  }
}
