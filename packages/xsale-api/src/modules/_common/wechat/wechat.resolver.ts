import { Resolver, Query, Args } from '@nestjs/graphql';
import { WechatService } from './wechat.service';
import { WechatJsConfig, WechatJsConfigWhere } from './wechat.dto';

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
