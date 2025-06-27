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
import { Affiliate } from '@/entities/affiliate.entity';
import { AffiliateService } from '../affiliate/affiliate.service';
import { WechatService } from '@/modules/_common/wechat/wechat.service';
import { CrmContext } from '@/types/graphql-context';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly affiliateService: AffiliateService,
    private readonly wechatService: WechatService,
  ) {}

  @Mutation(() => AuthToken)
  @UsePipes(new ValidationPipe({ transform: true }))
  login(@Args('data') data: LoginInput): Promise<AuthToken> {
    return this.authService.login(data);
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

  @Query(() => WechatAccessToken)
  async wechatAccessToken(
    @Args('code') code: string,
  ): Promise<WechatAccessToken> {
    // 获取微信用户信息
    const wechatAffiliateInfo =
      await this.wechatService.getOauthAccessToken(code);
    return {
      openId: wechatAffiliateInfo.openid,
      accessToken: wechatAffiliateInfo.access_token,
      expiresIn: wechatAffiliateInfo.expires_in,
    };
  }
}
