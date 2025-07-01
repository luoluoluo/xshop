import { Injectable, Logger } from '@nestjs/common';
import { WechatService } from './wechat.service';
import { WechatMessageService } from './wechat-message.service';
import { WechatConfigService } from './wechat-config.service';
import crypto from 'node:crypto';

export interface WechatEvent {
  ToUserName: string;
  FromUserName: string;
  CreateTime: number;
  MsgType: string;
  Event?: string;
  EventKey?: string;
  Content?: string;
  MsgId?: string;
  MediaId?: string;
  Format?: string;
  Recognition?: string;
  ThumbMediaId?: string;
  Location_X?: number;
  Location_Y?: number;
  Scale?: number;
  Label?: string;
  Title?: string;
  Description?: string;
  Url?: string;
  PicUrl?: string;
  Ticket?: string;
  Latitude?: number;
  Longitude?: number;
  Precision?: number;
}

@Injectable()
export class WechatEventService {
  private readonly logger = new Logger(WechatEventService.name);

  constructor(
    private readonly wechatService: WechatService,
    private readonly wechatMessageService: WechatMessageService,
    private readonly wechatConfigService: WechatConfigService,
  ) {}

  /**
   * 验证微信服务器签名
   */
  verifySignature(
    signature: string,
    timestamp: string,
    nonce: string,
  ): boolean {
    return this.wechatService.verifySignature(
      signature,
      timestamp,
      nonce,
      this.wechatConfigService.token,
    );
  }

  /**
   * 处理微信事件
   */
  async handleEvent(event: WechatEvent): Promise<string> {
    try {
      this.logger.log(
        `Received WeChat event: ${event.MsgType}${event.Event ? ` - ${event.Event}` : ''}`,
      );

      switch (event.MsgType) {
        case 'text':
          return this.handleTextMessage(event);
        case 'image':
          return this.handleImageMessage(event);
        case 'voice':
          return this.handleVoiceMessage(event);
        case 'video':
          return this.handleVideoMessage(event);
        case 'location':
          return this.handleLocationMessage(event);
        case 'link':
          return this.handleLinkMessage(event);
        case 'event':
          return await this.handleEventMessage(event);
        default:
          return this.generateReply(event, '暂不支持此类型消息');
      }
    } catch (error) {
      this.logger.error(`处理消息事件失败`, {
        error,
        openid: event.FromUserName,
        messageType: event.MsgType,
      });
      return this.generateReply(event, '服务器处理消息时出现错误');
    }
  }

  /**
   * 处理文本消息
   */
  private handleTextMessage(event: WechatEvent): string {
    const content = event.Content || '';

    // 简单的关键词回复
    if (content.includes('你好') || content.includes('hello')) {
      return this.generateReply(event, '您好！欢迎使用我们的服务。');
    }

    if (content.includes('帮助') || content.includes('help')) {
      return this.generateReply(
        event,
        '您可以输入以下关键词获取帮助：\n- 你好：打招呼\n- 帮助：获取帮助信息\n- 订单：查询订单状态',
      );
    }

    if (content.includes('订单')) {
      return this.generateReply(
        event,
        '请提供您的订单号，我来帮您查询订单状态。',
      );
    }

    // 默认回复
    return this.generateReply(
      event,
      `您发送的消息是：${content}\n如需帮助，请输入"帮助"。`,
    );
  }

  /**
   * 处理图片消息
   */
  private handleImageMessage(event: WechatEvent): string {
    return this.generateReply(event, '收到您的图片，感谢分享！');
  }

  /**
   * 处理语音消息
   */
  private handleVoiceMessage(event: WechatEvent): string {
    const recognition = event.Recognition || '';
    if (recognition) {
      return this.generateReply(event, `语音识别结果：${recognition}`);
    }
    return this.generateReply(event, '收到您的语音消息！');
  }

  /**
   * 处理视频消息
   */
  private handleVideoMessage(event: WechatEvent): string {
    return this.generateReply(event, '收到您的视频消息！');
  }

  /**
   * 处理位置消息
   */
  private handleLocationMessage(event: WechatEvent): string {
    const location = `${event.Location_X}, ${event.Location_Y}`;
    return this.generateReply(event, `收到您的位置信息：${location}`);
  }

  /**
   * 处理链接消息
   */
  private handleLinkMessage(event: WechatEvent): string {
    return this.generateReply(
      event,
      `收到您分享的链接：${event.Title || '无标题'}\n${event.Description || '无描述'}`,
    );
  }

  /**
   * 处理事件消息
   */
  private async handleEventMessage(event: WechatEvent): Promise<string> {
    switch (event.Event) {
      case 'subscribe':
        return await this.handleSubscribeEvent(event);
      case 'unsubscribe':
        return this.handleUnsubscribeEvent(event);
      case 'SCAN':
        return this.handleScanEvent(event);
      case 'LOCATION':
        return this.handleLocationEvent(event);
      case 'CLICK':
        return this.handleClickEvent(event);
      case 'VIEW':
        return this.handleViewEvent(event);
      default:
        this.logger.log(`Unhandled event: ${event.Event}`);
        return '';
    }
  }

  /**
   * 处理关注事件
   */
  private async handleSubscribeEvent(event: WechatEvent): Promise<string> {
    const welcomeMessage = `欢迎关注我们！🎉\n\n我们提供以下服务：\n- 商品浏览和购买\n- 订单查询和管理\n- 客户服务支持\n\n如需帮助，请输入"帮助"。`;

    // 如果有欢迎模板，可以发送模板消息
    if (this.wechatConfigService.templateIds.welcome) {
      try {
        await this.wechatService.sendTemplateMessage({
          touser: event.FromUserName,
          template_id: this.wechatConfigService.templateIds.welcome,
          url: 'https://your-domain.com/welcome',
          data: {
            first: { value: '欢迎关注我们！' },
            keyword1: { value: new Date().toLocaleString() },
            keyword2: { value: '新用户' },
            remark: { value: '感谢您的关注，我们将为您提供优质服务！' },
          },
        });
      } catch (error) {
        this.logger.error(
          `发送欢迎模板消息失败`,
          {
            error,
            openid: event.FromUserName,
            eventType: event.Event,
          },
        );
      }
    }

    return this.generateReply(event, welcomeMessage);
  }

  /**
   * 处理取消关注事件
   */
  private handleUnsubscribeEvent(event: WechatEvent): string {
    this.logger.log(`User ${event.FromUserName} unsubscribed`);
    // 取消关注事件不需要回复
    return '';
  }

  /**
   * 处理扫描二维码事件
   */
  private handleScanEvent(event: WechatEvent): string {
    const eventKey = event.EventKey || '';
    return this.generateReply(event, `扫描二维码事件，场景值：${eventKey}`);
  }

  /**
   * 处理上报地理位置事件
   */
  private handleLocationEvent(event: WechatEvent): string {
    const location = `${event.Latitude}, ${event.Longitude}`;
    this.logger.log(
      `User ${event.FromUserName} reported location: ${location}`,
    );
    // 地理位置上报事件不需要回复
    return '';
  }

  /**
   * 处理点击菜单事件
   */
  private handleClickEvent(event: WechatEvent): string {
    const eventKey = event.EventKey || '';

    switch (eventKey) {
      case 'HELP':
        return this.generateReply(
          event,
          '这是帮助菜单，您可以输入关键词获取帮助。',
        );
      case 'ORDER':
        return this.generateReply(
          event,
          '请提供您的订单号，我来帮您查询订单状态。',
        );
      case 'CONTACT':
        return this.generateReply(
          event,
          '客服电话：400-123-4567\n工作时间：9:00-18:00',
        );
      default:
        return this.generateReply(event, `点击了菜单：${eventKey}`);
    }
  }

  /**
   * 处理跳转链接事件
   */
  private handleViewEvent(event: WechatEvent): string {
    const eventKey = event.EventKey || '';
    this.logger.log(
      `User ${event.FromUserName} clicked menu link: ${eventKey}`,
    );
    // 跳转链接事件不需要回复
    return '';
  }

  /**
   * 生成回复消息
   */
  private generateReply(event: WechatEvent, content: string): string {
    const now = Math.floor(Date.now() / 1000);
    return `<xml>
<ToUserName><![CDATA[${event.FromUserName}]]></ToUserName>
<FromUserName><![CDATA[${event.ToUserName}]]></FromUserName>
<CreateTime>${now}</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[${content}]]></Content>
</xml>`;
  }
}
