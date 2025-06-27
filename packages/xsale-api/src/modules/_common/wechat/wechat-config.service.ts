import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WechatConfigService {
  constructor(private readonly configService: ConfigService) {}

  get appId(): string {
    return this.configService.get('WECHAT_APP_ID') || '';
  }

  get appSecret(): string {
    return this.configService.get('WECHAT_APP_SECRET') || '';
  }

  get token(): string {
    return this.configService.get('WECHAT_TOKEN') || '';
  }

  get encodingAESKey(): string {
    return this.configService.get('WECHAT_ENCODING_AES_KEY') || '';
  }

  get templateIds(): {
    orderNotification?: string;
    paymentSuccess?: string;
    welcome?: string;
  } {
    return {
      orderNotification: this.configService.get(
        'WECHAT_TEMPLATE_ORDER_NOTIFICATION',
      ),
      paymentSuccess: this.configService.get('WECHAT_TEMPLATE_PAYMENT_SUCCESS'),
      welcome: this.configService.get('WECHAT_TEMPLATE_WELCOME'),
    };
  }

  get isEnabled(): boolean {
    return !!(this.appId && this.appSecret);
  }

  validateConfig(): void {
    if (!this.appId) {
      throw new Error('WECHAT_APP_ID is required');
    }
    if (!this.appSecret) {
      throw new Error('WECHAT_APP_SECRET is required');
    }
  }
}
