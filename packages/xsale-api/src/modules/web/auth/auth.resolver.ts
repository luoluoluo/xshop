import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  AuthToken,
  LoginInput,
  UpdateMeInput,
  WechatAccessToken,
} from './auth.dto';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { Customer } from '@/entities/customer.entity';
import { CustomerService } from '../customer/customer.service';
import { WechatService } from '@/modules/_common/wechat/wechat.service';
import { WebContext } from '@/types/graphql-context';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly customerService: CustomerService,
    private readonly wechatService: WechatService,
  ) {}

  @Mutation(() => AuthToken)
  @UsePipes(new ValidationPipe({ transform: true }))
  login(@Args('data') data: LoginInput): Promise<AuthToken> {
    return this.authService.login(data);
  }

  @UseGuards(GqlAuthGuard)
  me(@Context() ctx: WebContext): Customer {
    console.log(ctx.req.user);
    return ctx.req.user!;
  }

  @Mutation(() => Customer)
  @UseGuards(GqlAuthGuard)
  async updateMe(
    @Args('data') data: UpdateMeInput,
    @Context() ctx: WebContext,
  ): Promise<Customer> {
    console.log(ctx.req, 222222);
    return this.customerService.update(ctx.req.user!.id, data);
  }

  @Query(() => WechatAccessToken)
  async wechatAccessToken(
    @Args('code') code: string,
  ): Promise<WechatAccessToken> {
    // 获取微信用户信息
    const wechatCustomerInfo =
      await this.wechatService.getOauthAccessToken(code);
    return {
      openId: wechatCustomerInfo.openid,
      accessToken: wechatCustomerInfo.access_token,
      expiresIn: wechatCustomerInfo.expires_in,
    };
  }
}
