import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  AuthToken,
  LoginInput,
  RegisterInput,
  SendSmsCodeInput,
  UpdateMeInput,
  UpdateWechatOAuthInput,
} from './auth.dto';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { Affiliate } from '@/entities/affiliate.entity';
import { AffiliateService } from '../affiliate/affiliate.service';
import { CrmContext } from '@/types/graphql-context';
import { WechatService } from '@/modules/_common/wechat/wechat.service';
import { WechatOAuth } from '@/entities/wechat-oauth.entity';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly affiliateService: AffiliateService,
    private readonly wechatService: WechatService,
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

  @Mutation(() => WechatOAuth)
  @UseGuards(GqlAuthGuard)
  async updateMeWechatOAuth(
    @Args('code') code: string,
    @Context() ctx: CrmContext,
  ): Promise<WechatOAuth> {
    // 获取微信用户信息
    const wechatAccessToken =
      await this.wechatService.getOauthAccessToken(code);
    if (wechatAccessToken.errcode) {
      throw new Error(wechatAccessToken.errmsg);
    }
    const data: UpdateWechatOAuthInput = {
      openId: wechatAccessToken.openid,
      accessToken: wechatAccessToken.access_token,
      expiresIn: wechatAccessToken.expires_in,
      refreshToken: wechatAccessToken.refresh_token,
    };
    if (wechatAccessToken.scope?.includes('snsapi_userinfo')) {
      const userInfo = await this.wechatService.getUserInfo(
        wechatAccessToken.access_token,
        wechatAccessToken.openid,
      );
      if (userInfo.errcode) {
        throw new Error(userInfo.errmsg);
      }
      data.nickName = userInfo.nickname;
      data.avatar = userInfo.headimgurl;
    }
    return this.affiliateService.updateMeWechatOAuth(ctx.req.user!.id, data);
  }
}
