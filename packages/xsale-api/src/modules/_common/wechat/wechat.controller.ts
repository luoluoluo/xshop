import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { WechatEventService, WechatEvent } from './wechat-event.service';
import { WechatConfigService } from './wechat-config.service';
import { Logger } from '@nestjs/common';

@Controller('wechat')
export class WechatController {
  private readonly logger = new Logger(WechatController.name);

  constructor(
    private readonly wechatEventService: WechatEventService,
    private readonly wechatConfigService: WechatConfigService,
  ) {}

  /**
   * 微信服务器验证接口
   */
  @Get()
  verify(
    @Query('signature') signature: string,
    @Query('timestamp') timestamp: string,
    @Query('nonce') nonce: string,
    @Query('echostr') echostr: string,
    @Res() res: Response,
  ): void {
    try {
      if (
        this.wechatEventService.verifySignature(signature, timestamp, nonce)
      ) {
        this.logger.log('WeChat server verification successful');
        res.status(HttpStatus.OK).send(echostr);
      } else {
        this.logger.warn('WeChat server verification failed');
        res.status(HttpStatus.UNAUTHORIZED).send('Verification failed');
      }
    } catch (error) {
      this.logger.error(
        `处理微信服务器验证失败`,
        {
          error,
          signature,
          timestamp,
          nonce,
        },
      );
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Server error');
    }
  }

  /**
   * 微信消息推送接口
   */
  @Post()
  async handleMessage(
    @Query('signature') signature: string,
    @Query('timestamp') timestamp: string,
    @Query('nonce') nonce: string,
    @Body() body: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // 验证签名
      if (
        !this.wechatEventService.verifySignature(signature, timestamp, nonce)
      ) {
        this.logger.warn('Invalid WeChat message signature');
        res.status(HttpStatus.UNAUTHORIZED).send('Invalid signature');
        return;
      }

      // 解析XML消息
      const event = this.parseWechatMessage(body);
      if (!event) {
        this.logger.warn('Failed to parse WeChat message');
        res.status(HttpStatus.BAD_REQUEST).send('Invalid message format');
        return;
      }

      // 处理消息
      const reply = await this.wechatEventService.handleEvent(event);

      // 返回回复
      res
        .status(HttpStatus.OK)
        .set('Content-Type', 'application/xml; charset=utf-8')
        .send(reply);
    } catch (error) {
      this.logger.error(`处理微信消息事件失败`, {
        error,
        signature,
        timestamp,
        nonce,
      });
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Server error');
    }
  }

  /**
   * 解析微信XML消息
   */
  private parseWechatMessage(xmlBody: string): WechatEvent | null {
    try {
      // 这里需要实现XML解析逻辑
      // 可以使用 xml2js 或其他XML解析库
      // 为了简化，这里返回一个基本的事件对象

      // 简单的XML解析（实际项目中建议使用专门的XML解析库）
      const event: WechatEvent = {
        ToUserName: this.extractXmlValue(xmlBody, 'ToUserName'),
        FromUserName: this.extractXmlValue(xmlBody, 'FromUserName'),
        CreateTime: parseInt(
          this.extractXmlValue(xmlBody, 'CreateTime') || '0',
        ),
        MsgType: this.extractXmlValue(xmlBody, 'MsgType'),
        Event: this.extractXmlValue(xmlBody, 'Event'),
        EventKey: this.extractXmlValue(xmlBody, 'EventKey'),
        Content: this.extractXmlValue(xmlBody, 'Content'),
        MsgId: this.extractXmlValue(xmlBody, 'MsgId'),
        MediaId: this.extractXmlValue(xmlBody, 'MediaId'),
        Format: this.extractXmlValue(xmlBody, 'Format'),
        Recognition: this.extractXmlValue(xmlBody, 'Recognition'),
        ThumbMediaId: this.extractXmlValue(xmlBody, 'ThumbMediaId'),
        Location_X: parseFloat(
          this.extractXmlValue(xmlBody, 'Location_X') || '0',
        ),
        Location_Y: parseFloat(
          this.extractXmlValue(xmlBody, 'Location_Y') || '0',
        ),
        Scale: parseInt(this.extractXmlValue(xmlBody, 'Scale') || '0'),
        Label: this.extractXmlValue(xmlBody, 'Label'),
        Title: this.extractXmlValue(xmlBody, 'Title'),
        Description: this.extractXmlValue(xmlBody, 'Description'),
        Url: this.extractXmlValue(xmlBody, 'Url'),
        PicUrl: this.extractXmlValue(xmlBody, 'PicUrl'),
        Ticket: this.extractXmlValue(xmlBody, 'Ticket'),
        Latitude: parseFloat(this.extractXmlValue(xmlBody, 'Latitude') || '0'),
        Longitude: parseFloat(
          this.extractXmlValue(xmlBody, 'Longitude') || '0',
        ),
        Precision: parseFloat(
          this.extractXmlValue(xmlBody, 'Precision') || '0',
        ),
      };

      return event;
    } catch (error) {
      this.logger.error(`解析微信消息失败`, {
        error,
        xmlBody,
      });
      return null;
    }
  }

  /**
   * 简单的XML值提取方法
   */
  private extractXmlValue(xml: string, tag: string): string {
    const regex = new RegExp(
      `<${tag}><!\\[CDATA\\[(.*?)\\]\\]></${tag}>|<${tag}>(.*?)</${tag}>`,
    );
    const match = xml.match(regex);
    return match ? match[1] || match[2] || '' : '';
  }
}
