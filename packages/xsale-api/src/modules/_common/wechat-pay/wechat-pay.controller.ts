import {
  Controller,
  Post,
  Headers,
  Logger,
  Body,
  Req,
  RawBodyRequest,
} from '@nestjs/common';
import { WechatPayNotifyResponse } from './wechat-pay.service';
import { WechatPayPartnerService } from './wechat-pay-partner.service';

@Controller('wechat-pay')
export class WechatPayController {
  private readonly logger = new Logger(WechatPayController.name);

  constructor(
    private readonly wechatPayPartnerService: WechatPayPartnerService,
  ) {}

  /**
   * 微信支付回调接口
   * 用于接收微信支付的异步通知
   */
  @Post('notify')
  async handlePaymentNotify(
    @Req() req: RawBodyRequest<Request>,
    @Headers() headers: Record<string, string>,
  ): Promise<WechatPayNotifyResponse> {
    const bodyString = req.rawBody?.toString() || '';
    this.logger.log('收到微信支付回调请求', {
      headers: {
        'wechatpay-timestamp': headers['wechatpay-timestamp'],
        'wechatpay-nonce': headers['wechatpay-nonce'],
        'wechatpay-signature': headers['wechatpay-signature'],
        'wechatpay-serial': headers['wechatpay-serial'],
      },
      contentType: headers['content-type'],
      bodyString,
    });

    try {
      const result = await this.wechatPayPartnerService.handlePaymentNotify(
        headers,
        bodyString,
      );

      this.logger.log('微信支付回调处理完成', { result });

      return result;
    } catch (error) {
      this.logger.error(`处理微信支付回调失败`, {
        error,
        headers,
        bodyString,
      });
      throw error;
    }
  }
}
