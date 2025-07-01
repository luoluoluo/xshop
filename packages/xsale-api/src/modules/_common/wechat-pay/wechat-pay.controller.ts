import { Controller, Post, Headers, Logger, Body } from '@nestjs/common';
import {
  WechatPayService,
  WechatPayNotifyResponse,
} from './wechat-pay.service';

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
    @Body() body: any,
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
      bodyType: typeof body,
      bodyIsObject: typeof body === 'object',
      bodyKeys: typeof body === 'object' ? Object.keys(body) : 'N/A',
    });

    // 将对象转换为字符串用于签名验证
    let bodyString: string;
    if (typeof body === 'string') {
      bodyString = body;
      this.logger.log('Body已经是字符串');
    } else if (typeof body === 'object' && body !== null) {
      // 重新序列化对象，保持字段顺序
      bodyString = JSON.stringify(body);
      this.logger.log('将对象序列化为字符串', {
        originalLength: bodyString.length,
        preview: bodyString.substring(0, 150),
      });
    } else {
      this.logger.error('无效的body类型', { bodyType: typeof body });
      return { code: 'FAIL', message: '无效的请求体' };
    }

    try {
      const result = await this.wechatPayService.handlePaymentNotify(
        headers,
        bodyString,
      );

      this.logger.log('微信支付回调处理完成', { result });

      return result;
    } catch (error) {
      this.logger.error(`处理微信支付回调失败`, {
        error,
        headers,
        body: body?.length > 500 ? body.substring(0, 500) + '...' : body,
      });
      throw error;
    }
  }
}
