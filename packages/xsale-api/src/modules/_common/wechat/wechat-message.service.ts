import { Injectable, Logger } from '@nestjs/common';
import { WechatService, SendCustomMessageRequest } from './wechat.service';

@Injectable()
export class WechatMessageService {
  private readonly logger = new Logger(WechatMessageService.name);

  constructor(private readonly wechatService: WechatService) {}

  /**
   * 发送文本消息
   */
  async sendTextMessage(openid: string, content: string): Promise<void> {
    const message: SendCustomMessageRequest = {
      touser: openid,
      msgtype: 'text',
      text: { content },
    };

    try {
      await this.wechatService.sendCustomMessage(message);
      this.logger.log(`Text message sent to ${openid}: ${content}`);
    } catch (error) {
      this.logger.error(`Failed to send text message to ${openid}:`, error);
      throw error;
    }
  }

  /**
   * 发送图片消息
   */
  async sendImageMessage(openid: string, mediaId: string): Promise<void> {
    const message: SendCustomMessageRequest = {
      touser: openid,
      msgtype: 'image',
      image: { media_id: mediaId },
    };

    try {
      await this.wechatService.sendCustomMessage(message);
      this.logger.log(`Image message sent to ${openid}`);
    } catch (error) {
      this.logger.error(`Failed to send image message to ${openid}:`, error);
      throw error;
    }
  }

  /**
   * 发送语音消息
   */
  async sendVoiceMessage(openid: string, mediaId: string): Promise<void> {
    const message: SendCustomMessageRequest = {
      touser: openid,
      msgtype: 'voice',
      voice: { media_id: mediaId },
    };

    try {
      await this.wechatService.sendCustomMessage(message);
      this.logger.log(`Voice message sent to ${openid}`);
    } catch (error) {
      this.logger.error(`Failed to send voice message to ${openid}:`, error);
      throw error;
    }
  }

  /**
   * 发送视频消息
   */
  async sendVideoMessage(
    openid: string,
    mediaId: string,
    thumbMediaId: string,
    title: string,
    description: string,
  ): Promise<void> {
    const message: SendCustomMessageRequest = {
      touser: openid,
      msgtype: 'video',
      video: {
        media_id: mediaId,
        thumb_media_id: thumbMediaId,
        title,
        description,
      },
    };

    try {
      await this.wechatService.sendCustomMessage(message);
      this.logger.log(`Video message sent to ${openid}`);
    } catch (error) {
      this.logger.error(`Failed to send video message to ${openid}:`, error);
      throw error;
    }
  }

  /**
   * 发送音乐消息
   */
  async sendMusicMessage(
    openid: string,
    title: string,
    description: string,
    musicUrl: string,
    hqMusicUrl: string,
    thumbMediaId: string,
  ): Promise<void> {
    const message: SendCustomMessageRequest = {
      touser: openid,
      msgtype: 'music',
      music: {
        title,
        description,
        musicurl: musicUrl,
        hqmusicurl: hqMusicUrl,
        thumb_media_id: thumbMediaId,
      },
    };

    try {
      await this.wechatService.sendCustomMessage(message);
      this.logger.log(`Music message sent to ${openid}`);
    } catch (error) {
      this.logger.error(`Failed to send music message to ${openid}:`, error);
      throw error;
    }
  }

  /**
   * 发送图文消息
   */
  async sendNewsMessage(
    openid: string,
    articles: Array<{
      title: string;
      description: string;
      url: string;
      picurl: string;
    }>,
  ): Promise<void> {
    const message: SendCustomMessageRequest = {
      touser: openid,
      msgtype: 'news',
      news: { articles },
    };

    try {
      await this.wechatService.sendCustomMessage(message);
      this.logger.log(`News message sent to ${openid}`);
    } catch (error) {
      this.logger.error(`Failed to send news message to ${openid}:`, error);
      throw error;
    }
  }

  /**
   * 发送订单通知消息
   */
  async sendOrderNotification(
    openid: string,
    orderId: string,
    orderStatus: string,
    amount: number,
    url: string,
  ): Promise<void> {
    const templateData = {
      touser: openid,
      template_id: 'YOUR_TEMPLATE_ID', // 需要配置模板ID
      url,
      data: {
        first: { value: '您的订单状态已更新' },
        keyword1: { value: orderId },
        keyword2: { value: orderStatus },
        keyword3: { value: `¥${amount.toFixed(2)}` },
        remark: { value: '感谢您的使用！' },
      },
    };

    try {
      await this.wechatService.sendTemplateMessage(templateData);
      this.logger.log(
        `Order notification sent to ${openid} for order ${orderId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send order notification to ${openid}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * 发送支付成功通知
   */
  async sendPaymentSuccessNotification(
    openid: string,
    orderId: string,
    amount: number,
    paymentTime: string,
    url: string,
  ): Promise<void> {
    const templateData = {
      touser: openid,
      template_id: 'YOUR_PAYMENT_TEMPLATE_ID', // 需要配置模板ID
      url,
      data: {
        first: { value: '支付成功通知' },
        keyword1: { value: orderId },
        keyword2: { value: `¥${amount.toFixed(2)}` },
        keyword3: { value: paymentTime },
        remark: { value: '感谢您的购买！' },
      },
    };

    try {
      await this.wechatService.sendTemplateMessage(templateData);
      this.logger.log(
        `Payment success notification sent to ${openid} for order ${orderId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send payment notification to ${openid}:`,
        error,
      );
      throw error;
    }
  }
}
