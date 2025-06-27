import { Controller, Post, Headers, Body, Logger } from '@nestjs/common';
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
    @Headers() headers: Record<string, string>,
    @Body() body: string,
  ): Promise<WechatPayNotifyResponse> {
    this.logger.log('收到微信支付回调请求', {
      headers: {
        'wechatpay-timestamp': headers['wechatpay-timestamp'],
        'wechatpay-nonce': headers['wechatpay-nonce'],
        'wechatpay-signature': headers['wechatpay-signature'],
        'wechatpay-serial': headers['wechatpay-serial'],
      },
      bodyLength: body?.length,
    });

    try {
      const result = await this.wechatPayService.handlePaymentNotify(
        headers,
        body,
      );

      this.logger.log('微信支付回调处理完成', { result });

      return result;
    } catch (error) {
      this.logger.error('微信支付回调处理异常', error);
      return { code: 'FAIL', message: '处理异常' };
    }
  }
}
