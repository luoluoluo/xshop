import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  AuthToken,
  LoginInput,
  RegisterInput,
  SendSmsCodeInput,
  UpdateMeInput,
} from './auth.dto';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { Affiliate } from '@/entities/affiliate.entity';
import { AffiliateService } from '../affiliate/affiliate.service';
import { CrmContext } from '@/types/graphql-context';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly affiliateService: AffiliateService,
  ) {}

  @Mutation(() => Boolean)
  sendSmsCode(@Args('data') data: SendSmsCodeInput) {
    return this.authService.sendSmsCode(data);
  }

  @Mutation(() => AuthToken)
  @UsePipes(new ValidationPipe({ transform: true }))
  login(@Args('data') data: LoginInput): Promise<AuthToken> {
    return this.authService.login(data);
  }

  @Mutation(() => AuthToken)
  register(@Args('data') data: RegisterInput) {
    return this.authService.register(data);
  }

  @Query(() => Affiliate)
  @UseGuards(GqlAuthGuard)
  me(@Context() ctx: CrmContext): Affiliate {
    console.log(ctx.req.user);
    return ctx.req.user!;
  }

  @Mutation(() => Affiliate)
  @UseGuards(GqlAuthGuard)
  async updateMe(
    @Args('data') data: UpdateMeInput,
    @Context() ctx: CrmContext,
  ): Promise<Affiliate> {
    return this.affiliateService.updateMe(ctx.req.user!.id, data);
  }
}
