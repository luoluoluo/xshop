import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthToken, LoginInput } from './auth.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { Merchant } from '@/entities/merchant.entity';
import { PmsContext } from '@/types/graphql-context';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthToken)
  login(@Args('data') data: LoginInput) {
    return this.authService.login(data.phone, data.password);
  }

  @Query(() => Merchant)
  @UseGuards(GqlAuthGuard)
  me(@Context() ctx: PmsContext) {
    return ctx.req.user;
  }
}
