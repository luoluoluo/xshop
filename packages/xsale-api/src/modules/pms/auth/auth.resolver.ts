import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  AuthToken,
  LoginInput,
  RegisterInput,
  SendSmsCodeInput,
  UpdateMeInput,
} from './auth.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { Merchant } from '@/entities/merchant.entity';
import { PmsContext } from '@/types/graphql-context';
import { MerchantService } from '../merchant/merchant.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly merchantService: MerchantService,
  ) {}

  @Mutation(() => Boolean)
  sendSmsCode(@Args('data') data: SendSmsCodeInput) {
    return this.authService.sendSmsCode(data);
  }

  @Mutation(() => AuthToken)
  login(@Args('data') data: LoginInput) {
    return this.authService.login(data);
  }

  @Mutation(() => AuthToken)
  register(@Args('data') data: RegisterInput) {
    return this.authService.register(data);
  }

  @Query(() => Merchant)
  @UseGuards(GqlAuthGuard)
  me(@Context() ctx: PmsContext) {
    return ctx.req.user;
  }

  @Mutation(() => Merchant)
  @UseGuards(GqlAuthGuard)
  async updateMe(
    @Args('data') data: UpdateMeInput,
    @Context() ctx: PmsContext,
  ): Promise<Merchant> {
    return this.merchantService.update(ctx.req.user!.id, data);
  }
}
