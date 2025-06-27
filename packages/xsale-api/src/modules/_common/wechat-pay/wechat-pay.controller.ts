import { Controller, Post, Headers, Logger, Req } from '@nestjs/common';
import {
  WechatPayService,
  WechatPayNotifyResponse,
} from './wechat-pay.service';
import { Request } from 'express';

@Controller('wechat-pay')
export class WechatPayController {
  private readonly logger = new Logger(WechatPayController.name);

  constructor(private readonly wechatPayService: WechatPayService) {}

  /**
   * 微信支付回调接口
   * 用于接收微信支付的异步通知
   */
  @Post('notify')
  async handlePaymentNotify(
    @Req() request: Request,
    @Headers() headers: Record<string, string>,
  ): Promise<WechatPayNotifyResponse> {
    this.logger.log('收到微信支付回调请求', {
      headers: {
        'wechatpay-timestamp': headers['wechatpay-timestamp'],
        'wechatpay-nonce': headers['wechatpay-nonce'],
        'wechatpay-signature': headers['wechatpay-signature'],
        'wechatpay-serial': headers['wechatpay-serial'],
      },
      contentType: headers['content-type'],
      method: request.method,
      url: request.url,
    });

    // 获取原始body - 优先使用rawBody
    let rawBody: string;

    if ((request as any).rawBody) {
      // 优先使用rawBody（由中间件提供）
      rawBody = (request as any).rawBody;
      this.logger.log('使用rawBody（中间件提供）', {
        rawBodyLength: rawBody.length,
      });
    } else if (request.body && typeof request.body === 'string') {
      // 如果body已经是字符串
      rawBody = request.body;
      this.logger.log('使用字符串body');
    } else if (request.body && typeof request.body === 'object') {
      // 如果body是对象，重新序列化（可能不准确）
      rawBody = JSON.stringify(request.body);
      this.logger.warn('Body已被解析为对象，重新序列化可能导致签名验证失败', {
        bodyKeys: Object.keys(request.body),
        注意: '建议检查中间件配置',
      });
    } else {
      this.logger.error('无法获取请求体', {
        bodyType: typeof request.body,
        hasBody: !!request.body,
        hasRawBody: !!(request as any).rawBody,
      });
      return { code: 'FAIL', message: '无法获取请求体' };
    }

    this.logger.log('请求体信息', {
      bodyType: typeof rawBody,
      bodyLength: rawBody?.length,
      bodyPreview: rawBody?.substring(0, 100),
    });

    try {
      const result = await this.wechatPayService.handlePaymentNotify(
        headers,
        rawBody,
      );

      this.logger.log('微信支付回调处理完成', { result });

      return result;
    } catch (error) {
      this.logger.error('微信支付回调处理异常', error);
      return { code: 'FAIL', message: '处理异常' };
    }
  }
}
