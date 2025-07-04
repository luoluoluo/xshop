import { Logger, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { RedisService } from '../redis/redis.service';
import { WechatConfigService } from './wechat-config.service';
import { WechatJsConfig } from './wechat.dto';

const accessTokenCacheKey = 'xsale:wechat:access-token';
const ticketCackeKey = 'xsale:wechat:ticket';
const getAccessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token';
const getOauthAccessTokenUrl =
  'https://api.weixin.qq.com/sns/oauth2/access_token';
const sendTemplateMessageUrl =
  'https://api.weixin.qq.com/cgi-bin/message/template/send';
const getTicketUrl =
  'https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi';
const getUserInfoUrl = 'https://api.weixin.qq.com/sns/userinfo';
const sendCustomMessageUrl =
  'https://api.weixin.qq.com/cgi-bin/message/custom/send';

interface Response {
  errcode: number;
  errmsg: string;
}

export interface GetOauthAccessTokenRequest {
  grant_type: string; // authorization_code
  appid: string;
  secret: string;
  code: string;
}

export interface GetOauthAccessTokenResponse extends Response {
  access_token: string;
  expires_in: number;
  openid: string;
  scope?: string;
  unionid?: string;
}

export interface GetAccessTokenRequest {
  grant_type: string; // client_credential
  appid: string;
  secret: string;
}

export interface GetAccessTokenResponse extends Response {
  access_token: string;
  expires_in: number;
}

export type SendTemplateMessageRequestData = Record<
  string,
  {
    value: string;
  }
>;

export interface SendTemplateMessageRequest {
  touser: string;
  template_id: string;
  url: string;
  data: SendTemplateMessageRequestData;
}

export interface GetTicketResponse extends Response {
  ticket: string;
  expires_in: number;
}

export interface JsConfig {
  appId: string;
  timestamp: number;
  nonceStr: string;
  signature: string;
}

export interface GetUserInfoRequest {
  access_token: string;
  openid: string;
  lang?: string;
}

export interface GetUserInfoResponse extends Response {
  openid: string;
  nickname: string;
  sex: number;
  province: string;
  city: string;
  country: string;
  headimgurl: string;
  privilege: string[];
  unionid?: string;
}

export interface SendCustomMessageRequest {
  touser: string;
  msgtype: 'text' | 'image' | 'voice' | 'video' | 'music' | 'news';
  text?: {
    content: string;
  };
  image?: {
    media_id: string;
  };
  voice?: {
    media_id: string;
  };
  video?: {
    media_id: string;
    thumb_media_id: string;
    title: string;
    description: string;
  };
  music?: {
    title: string;
    description: string;
    musicurl: string;
    hqmusicurl: string;
    thumb_media_id: string;
  };
  news?: {
    articles: Array<{
      title: string;
      description: string;
      url: string;
      picurl: string;
    }>;
  };
}

@Injectable()
export class WechatService {
  private readonly logger = new Logger(WechatService.name);

  constructor(
    private readonly configService: WechatConfigService,
    private readonly redisService: RedisService,
  ) {
    // 验证配置，但不阻止应用启动
    try {
      this.configService.validateConfig();
    } catch (error) {
      this.logger.warn('微信配置验证失败', error.message);
    }
  }

  // 网页授权
  getOauthAccessToken = async (
    code: string,
  ): Promise<GetOauthAccessTokenResponse> => {
    const data = {
      appid: this.configService.appId,
      secret: this.configService.appSecret,
      grant_type: 'authorization_code',
      code,
    };
    const url = `${getOauthAccessTokenUrl}?${new URLSearchParams(data).toString()}`;
    const res = await fetch(url);
    return res.json() as Promise<GetOauthAccessTokenResponse>;
  };

  // 获取用户信息
  getUserInfo = async (
    accessToken: string,
    openid: string,
    lang: string = 'zh_CN',
  ): Promise<GetUserInfoResponse> => {
    const data = {
      access_token: accessToken,
      openid,
      lang,
    };
    const url = `${getUserInfoUrl}?${new URLSearchParams(data).toString()}`;
    const res = await fetch(url);
    return res.json() as Promise<GetUserInfoResponse>;
  };

  // token
  getAccessToken = async (): Promise<string> => {
    const accessToken = await this.redisService.get(accessTokenCacheKey);
    if (accessToken) {
      return accessToken;
    }
    const data = {
      appid: this.configService.appId,
      secret: this.configService.appSecret,
      grant_type: 'client_credential',
    };
    const url = `${getAccessTokenUrl}?${new URLSearchParams(data).toString()}`;
    const res = await fetch(url);
    const resData = await (res.json() as Promise<GetAccessTokenResponse>);
    console.log(resData);
    if (resData.errcode) {
      throw new Error(resData.errmsg);
    }
    await this.redisService.set(
      accessTokenCacheKey,
      resData.access_token,
      resData.expires_in - 60,
    );
    return resData.access_token;
  };

  // 发送模板消息
  sendTemplateMessage = async (
    data: SendTemplateMessageRequest,
  ): Promise<Response> => {
    const accessToken = await this.getAccessToken();
    const url = `${sendTemplateMessageUrl}?access_token=${accessToken}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
      }).then((res) => {
        return res.json() as Promise<Response>;
      });
      if (res.errcode) {
        this.logger.error(res, 'sendTemplateMessage error');
        throw new Error(res.errmsg);
      }
      return res;
    } catch (error) {
      this.logger.error('微信接口调用失败', {
        error,
        endpoint: url,
        method: 'POST',
        data,
      });
      throw error;
    }
  };

  // 发送客服消息
  sendCustomMessage = async (
    data: SendCustomMessageRequest,
  ): Promise<Response> => {
    const accessToken = await this.getAccessToken();
    const url = `${sendCustomMessageUrl}?access_token=${accessToken}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
      }).then((res) => {
        return res.json() as Promise<Response>;
      });
      if (res.errcode) {
        this.logger.error(res, 'sendCustomMessage error');
        throw new Error(res.errmsg);
      }
      return res;
    } catch (error) {
      this.logger.error('微信接口调用失败', {
        error,
        endpoint: url,
        method: 'POST',
        data,
      });
      throw error;
    }
  };

  getTicket = async (): Promise<string> => {
    const ticket = await this.redisService.get(ticketCackeKey);
    if (ticket) {
      return ticket;
    }
    const accessToken = await this.getAccessToken();
    const res = await fetch(`${getTicketUrl}&access_token=${accessToken}`).then(
      (res) => res.json() as Promise<GetTicketResponse>,
    );
    if (res.errcode) {
      this.logger.error(res, 'getJsConfig error');
      throw new Error(res.errmsg);
    }
    await this.redisService.set(
      ticketCackeKey,
      res.ticket,
      res.expires_in - 60,
    );
    return res.ticket;
  };

  getJsConfig = async (url: string): Promise<WechatJsConfig> => {
    const ticket = await this.getTicket();
    const nonceStr = Math.random().toString(36).slice(2, 17);
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const sortedStr = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
    const signature = crypto.createHash('sha1').update(sortedStr).digest('hex');
    return {
      appId: this.configService.appId,
      timestamp,
      nonceStr,
      signature,
    };
  };

  // 生成微信授权URL
  generateOauthUrl = (
    redirectUrl: string,
    scope: 'snsapi_base' | 'snsapi_userinfo' = 'snsapi_base',
    state: string = 'wechat',
  ): string => {
    const params = new URLSearchParams({
      appid: this.configService.appId,
      redirect_uri: redirectUrl,
      response_type: 'code',
      scope,
      state,
    });
    return `https://open.weixin.qq.com/connect/oauth2/authorize?${params.toString()}#wechat_redirect`;
  };

  // 验证微信签名
  verifySignature = (
    signature: string,
    timestamp: string,
    nonce: string,
    token: string,
  ): boolean => {
    const sortedStr = [token, timestamp, nonce].sort().join('');
    const expectedSignature = crypto
      .createHash('sha1')
      .update(sortedStr)
      .digest('hex');
    return signature === expectedSignature;
  };
}
