import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthToken, LoginInput } from './auth.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { User } from '@/entities/user.entity';
import { AdminContext } from '@/types/graphql-context';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthToken)
  login(@Args('data') data: LoginInput) {
    return this.authService.login(data.email, data.password);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  me(@Context() ctx: AdminContext) {
    return ctx.req.user;
  }
}
