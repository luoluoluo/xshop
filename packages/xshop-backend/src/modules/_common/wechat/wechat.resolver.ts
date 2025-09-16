import { Resolver, Query, Args } from '@nestjs/graphql';
import { WechatService } from './wechat.service';
import {
  WechatAccessToken,
  WechatJsConfig,
  WechatJsConfigWhere,
} from './wechat.dto';

@Resolver()
export class WechatResolver {
  constructor(private readonly wechatService: WechatService) {}

  @Query(() => WechatJsConfig, { nullable: true })
  async wechatJsConfig(
    @Args('where') where: WechatJsConfigWhere,
  ): Promise<WechatJsConfig> {
    if (!where.url) {
      throw new Error('URL is required');
    }
    return this.wechatService.getJsConfig(where.url);
  }

  @Query(() => String)
  wechatOauthUrl(
    @Args('redirectUrl') redirectUrl: string,
    @Args('scope', { nullable: true })
    scope?: 'snsapi_base' | 'snsapi_userinfo',
    @Args('state', { nullable: true }) state?: string,
  ): string {
    return this.wechatService.generateOauthUrl(redirectUrl, scope, state);
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

  @Query(() => Boolean)
  wechatVerifySignature(
    @Args('signature') signature: string,
    @Args('timestamp') timestamp: string,
    @Args('nonce') nonce: string,
    @Args('token') token: string,
  ): boolean {
    return this.wechatService.verifySignature(
      signature,
      timestamp,
      nonce,
      token,
    );
  }
}
