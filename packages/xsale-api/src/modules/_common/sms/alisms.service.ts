// This file is auto-generated, don't edit it
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class AlismsService {
  private readonly client: Dysmsapi20170525;

  constructor(private readonly configService: ConfigService) {
    const config = new $OpenApi.Config({
      // 您的AccessKey ID
      accessKeyId: this.configService.get('ALIBABA_CLOUD_ACCESS_KEY_ID'),
      // 您的AccessKey Secret
      accessKeySecret: this.configService.get(
        'ALIBABA_CLOUD_ACCESS_KEY_SECRET',
      ),
    });
    // Endpoint 请参考 https://api.aliyun.com/product/Dysmsapi
    config.endpoint = `dysmsapi.aliyuncs.com`;
    this.client = new Dysmsapi20170525(config);
  }

  async sendCode(phone: string, code: string): Promise<void> {
    await this.send({
      phoneNumbers: phone,
      signName: this.configService.get('ALIBABA_CLOUD_SMS_SIGN_NAME') || '',
      templateCode:
        this.configService.get('ALIBABA_CLOUD_SMS_TEMPLATE_CODE') || '',
      templateParam: JSON.stringify({ code }),
    });
  }

  async send(params: {
    phoneNumbers: string;
    signName: string;
    templateCode: string;
    templateParam: string;
  }): Promise<void> {
    const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest(params);
    try {
      // 复制代码运行请自行打印 API 的返回值
      await this.client.sendSmsWithOptions(
        sendSmsRequest,
        new $Util.RuntimeOptions({}),
      );
    } catch (error) {
      // 此处仅做打印展示，请谨慎对待异常处理，在工程项目中切勿直接忽略异常。
      // 错误 message
      console.log(error.message);
      // 诊断地址
      console.log(error.data['Recommend']);
    }
  }
}
