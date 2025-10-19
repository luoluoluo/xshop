import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { User } from '@/entities/user.entity';
import { UserService } from './user.service';
import { UserAuthGuard } from '@/modules/_common/auth/guards/user-auth.guard';
import { UserSession } from '@/modules/_common/auth/decorators/user-session.decorator';
import { UpdateMeInput } from './user.dto';

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
    user.products = user.products?.filter((product) => product.isActive);
    return user;
  }

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
}
