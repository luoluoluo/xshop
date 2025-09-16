import * as x509 from '@fidm/x509';
import { Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as crypto from 'crypto';
import { PaymentSuccessEvent } from '@/events/payment-success.event';

const BASE_URL = 'https://api.mch.weixin.qq.com';
const TRANSACTIONS_JSAPI_URL = `${BASE_URL}/v3/pay/partner/transactions/jsapi`;
const REFUND_URL = `${BASE_URL}/v3/refund/domestic/refunds`;
const PROFITSHARING_ADD_RECEIVERS_URL = `${BASE_URL}/v3/profitsharing/receivers/add`;
const PROFITSHARING_CREATE_ORDERS_URL = `${BASE_URL}/v3/profitsharing/orders`;

const AUTH_TYPE = 'WECHATPAY2-SHA256-RSA2048';

export interface PayAmount {
  total: number;
  currency?: string;
}

// 服务商支付特有的支付者信息
interface PayPayer {
  sp_openid?: string;
  sub_openid?: string;
}

// 服务商支付的交易请求
export interface PartnerTransactionRequest {
  sp_appid?: string;
  sp_mchid?: string;
  sub_mchid: string;
  sub_appid?: string;
  description: string;
  out_trade_no: string;
  time_expire?: string;
  attach?: string;
  notify_url?: string;
  goods_tag?: string;
  amount: PayAmount;
  payer: PayPayer;
  settle_info?: {
    profit_sharing?: boolean;
  };
}

interface TransactionResponse {
  code?: string;
  message?: string;
  prepay_id: string;
}

// 服务商支付的退款请求
export interface PartnerRefundRequest {
  sub_mchid: string;
  out_refund_no: string;
  amount: {
    refund: number;
    total: number;
    currency: string;
  };
  out_trade_no: string;
}

export interface RefundResponse {
  code?: string;
  message?: string;
  status: string;
  out_trade_no?: string;
  refund_id?: string;
}

// 服务商支付的分账接收方
export interface PartnerProfitsharingReceiver {
  type: 'MERCHANT_ID' | 'PERSONAL_OPENID' | 'PERSONAL_SUB_OPENID';
  account: string;
  name?: string;
  relation_type: 'STORE' | 'STAFF' | 'STORE_OWNER' | 'PARTNER' | 'HEADQUARTER';
}

export interface PartnerProfitsharingAddReceiversRequest
  extends PartnerProfitsharingReceiver {
  appid?: string;
  sub_mchid: string;
  sub_appid?: string;
}

export interface ProfitsharingAddReceiversResponse {
  code?: string;
  message?: string;
  status: string;
}

// 服务商支付的分账订单
export interface PartnerProfitsharingCreateOrdersRequest {
  appid?: string;
  sub_mchid: string;
  transaction_id: string;
  out_order_no: string;
  receivers: Array<{
    type: PartnerProfitsharingReceiver['type'];
    account: string;
    name?: string;
    amount: number;
    description: string;
  }>;
  unfreeze_unsplit: boolean;
}

// 微信支付回调相关接口
export interface WechatPayNotifyResource {
  algorithm: string;
  ciphertext: string;
  associated_data: string;
  nonce: string;
}

export interface WechatPayNotifyRequest {
  id: string;
  create_time: string;
  resource_type: string;
  event_type: string;
  summary: string;
  resource: WechatPayNotifyResource;
}

export interface WechatPayNotifyResponse {
  code: string;
  message: string;
}

// 服务商支付的交易结果
export interface PartnerWechatPayTransactionResult {
  sp_appid: string;
  sp_mchid: string;
  sub_mchid: string;
  sub_appid?: string;
  out_trade_no: string;
  transaction_id: string;
  trade_type: string;
  trade_state: string;
  trade_state_desc: string;
  bank_type: string;
  attach: string;
  success_time: string;
  payer: {
    sp_openid?: string;
    sub_openid?: string;
  };
  amount: {
    total: number;
    payer_total: number;
    currency: string;
    payer_currency: string;
  };
}

@Injectable()
export class WechatPayPartnerService {
  private readonly logger = new Logger(WechatPayPartnerService.name);
  private certificateCache = new Map<string, string>();
  private config: {
    key: string;
    privateKey: string;
    publicKey: string;
    spMchId: string;
    spAppId: string;
    notifyUrl: string;
    certificate: string;
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.config = {
      key: this.configService.get('WECHAT_PAY_SP_KEY') || '',
      privateKey: this.configService.get('WECHAT_PAY_SP_PRIVATE_KEY') || '',
      publicKey: this.configService.get('WECHAT_PAY_SP_PUBLIC_KEY') || '',
      spMchId: this.configService.get('WECHAT_PAY_SP_MCHID') || '',
      spAppId: this.configService.get('WECHAT_APP_ID') || '',
      notifyUrl: this.configService.get('WECHAT_PAY_NOTIFY_URL') || '',
      certificate: this.configService.get('WECHAT_PAY_SP_CERTIFICATE') || '',
    };
  }

  private decipherGcm = <T>({
    ciphertext,
    associated_data,
    nonce,
  }: {
    ciphertext: string;
    associated_data: string;
    nonce: string;
  }): T => {
    if (!this.config.key) throw new Error('缺少key');
    const _ciphertext = Buffer.from(ciphertext, 'base64');
    const authTag: any = _ciphertext.slice(_ciphertext.length - 16);
    const data = _ciphertext.slice(0, _ciphertext.length - 16);
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      this.config.key,
      nonce,
    );
    decipher.setAuthTag(authTag);
    decipher.setAAD(Buffer.from(associated_data));
    const decoded = decipher.update(data, undefined, 'utf8');
    try {
      return JSON.parse(decoded);
    } catch (e) {
      this.logger.error(`JSON解析失败`, { error: e, decoded });
      return decoded as T;
    }
  };

  private sha256WithRsa = (data: string): string => {
    if (!this.config.privateKey) throw new Error('缺少秘钥文件');
    return crypto
      .createSign('RSA-SHA256')
      .update(data)
      .sign(this.config.privateKey, 'base64');
  };

  private getSN = (): string => {
    if (!this.config.certificate) throw new Error('缺少公钥');
    const certificate = x509.Certificate.fromPEM(
      Buffer.from(this.config.certificate),
    );
    return certificate.serialNumber;
  };

  private request = async <T>(url: string, init?: RequestInit) => {
    const method = init?.method || 'GET';
    const body = (init?.body as string) || '';
    const nonceStr = Math.random().toString(36).slice(2, 17);
    const timestamp = String(Math.round(new Date().getTime() / 1000));
    const str = `${method}\n${url.replace(BASE_URL, '')}\n${timestamp}\n${nonceStr}\n${body}\n`;

    this.logger.log('签名字符串', { str, method, url });

    const signature = this.sha256WithRsa(str);
    const sn = this.getSN();
    const authorization = `${AUTH_TYPE} mchid="${this.config.spMchId}",nonce_str="${nonceStr}",timestamp="${timestamp}",serial_no="${sn}",signature="${signature}"`;

    const headers = {
      Authorization: authorization,
      'Accept-Language': 'zh-CN',
      'Content-Type': 'application/json',
      'User-Agent': 'WechatPay-APIv3-NodeJS-SDK',
      ...(init?.headers || {}),
    };

    try {
      const response = await fetch(url, { ...init, headers });

      this.logger.log('API请求', {
        url,
        method,
        status: response.status,
        spMchId: this.config.spMchId,
        serialNo: sn,
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error('API请求失败', {
          url,
          method,
          status: response.status,
          statusText: response.statusText,
          errorText,
          authorization: authorization.substring(0, 50) + '...',
        });
        throw new Error(
          `API请求失败: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const result = (await response.json()) as T;
      this.logger.log('API响应成功', { url, method, hasData: !!result });
      return result;
    } catch (error) {
      this.logger.error('API请求异常', {
        url,
        method,
        error: error.message,
        spMchId: this.config.spMchId,
      });
      throw error;
    }
  };

  // JSAPI支付
  async createTransactionsJsapi(params: PartnerTransactionRequest) {
    // 设置服务商信息
    params.sp_appid = params.sp_appid || this.config.spAppId;
    params.sp_mchid = params.sp_mchid || this.config.spMchId;
    if (!params.notify_url) params.notify_url = this.config.notifyUrl;
    if (!params.sp_appid) {
      params.sub_appid = params.sub_appid || this.config.spAppId;
    }

    const result = await this.request<TransactionResponse>(
      TRANSACTIONS_JSAPI_URL,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    );

    if (result.code) {
      this.logger.error({ params, result }, '服务商支付失败');
      throw new Error(result.message);
    }

    // 生成支付参数
    const data = {
      appId: params.sub_appid || params.sp_appid, // 优先使用子商户APPID
      timeStamp: parseInt(+new Date() / 1000 + '').toString(),
      nonceStr: Math.random().toString(36).substr(2, 15),
      package: `prepay_id=${result.prepay_id}`,
      signType: 'RSA',
      paySign: '',
    };

    data.paySign = this.sha256WithRsa(
      [data.appId, data.timeStamp, data.nonceStr, data.package, ''].join('\n'),
    );

    return data;
  }

  // 退款
  async refund(params: PartnerRefundRequest) {
    const result = await this.request<RefundResponse>(REFUND_URL, {
      method: 'POST',
      body: JSON.stringify(params),
    });

    if (result.code && result.status !== 'SUCCESS') {
      this.logger.error({ params, result }, '退款失败');
      throw new Error(result.message);
    }

    return result;
  }

  // 添加分账接收方
  async profitsharingAddReceivers(
    params: PartnerProfitsharingAddReceiversRequest,
  ) {
    params.appid = params.appid || this.config.spAppId;
    const result = await this.request<ProfitsharingAddReceiversResponse>(
      PROFITSHARING_ADD_RECEIVERS_URL,
      {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Wechatpay-Serial': this.getSN() },
      },
    );

    if (result.code && result.status !== 'SUCCESS') {
      this.logger.error({ params, result }, '添加分账接收方失败');
      throw new Error(result.message);
    }

    return result;
  }

  // 创建分账订单
  async profitsharingCreateOrders(
    params: PartnerProfitsharingCreateOrdersRequest,
  ) {
    params.appid = params.appid || this.config.spAppId;
    const result = await this.request<ProfitsharingAddReceiversResponse>(
      PROFITSHARING_CREATE_ORDERS_URL,
      {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Wechatpay-Serial': this.getSN() },
      },
    );

    if (result.code && result.status !== 'SUCCESS') {
      this.logger.error({ params, result }, '创建分账订单失败');
      throw new Error(result.message);
    }

    return result;
  }

  // 处理支付回调
  handlePaymentNotify(
    headers: Record<string, string>,
    body: string,
  ): WechatPayNotifyResponse {
    try {
      const timestamp = headers['wechatpay-timestamp'];
      const nonce = headers['wechatpay-nonce'];
      const signature = headers['wechatpay-signature'];
      const serial = headers['wechatpay-serial'];

      if (!timestamp || !nonce || !signature || !serial) {
        this.logger.error('缺少必要的签名参数', { headers });
        return { code: 'FAIL', message: '缺少必要的签名参数' };
      }

      // 验证签名
      const isValid = this.verifySign({
        timestamp,
        nonce,
        body,
        signature,
        serial,
      });

      if (!isValid) {
        this.logger.error('签名验证失败', { headers, body });
        return { code: 'FAIL', message: '签名验证失败' };
      }

      // 解析回调数据
      const notifyData: WechatPayNotifyRequest = JSON.parse(body);
      this.logger.log('收到微信服务商支付回调', { notifyData });

      // 解密资源数据
      const decryptedData = this.decipherGcm<PartnerWechatPayTransactionResult>(
        notifyData.resource,
      );

      // 根据事件类型处理不同的回调
      switch (notifyData.event_type) {
        case 'TRANSACTION.SUCCESS':
          try {
            this.logger.log('处理服务商支付成功回调', { data: decryptedData });

            if (decryptedData.trade_state !== 'SUCCESS') {
              this.logger.warn('支付状态不是成功', {
                tradeState: decryptedData.trade_state,
              });
              return {
                code: 'SUCCESS',
                message: '支付状态不是成功，但处理完成',
              };
            }

            // 处理支付成功业务逻辑
            this.processPaymentSuccess(decryptedData);

            return { code: 'SUCCESS', message: '处理成功' };
          } catch (error) {
            this.logger.error('处理支付成功回调失败', error);
            return { code: 'FAIL', message: '处理支付成功回调失败' };
          }
        default:
          this.logger.warn('未知的事件类型', {
            eventType: notifyData.event_type,
          });
          return { code: 'SUCCESS', message: '未知事件类型，但处理成功' };
      }
    } catch (error) {
      this.logger.error('处理微信服务商支付回调失败', error);
      return { code: 'FAIL', message: '处理失败' };
    }
  }

  private verifySign(params: {
    timestamp: string | number;
    nonce: string;
    body: string;
    signature: string;
    serial: string;
  }) {
    const { timestamp, nonce, body, signature } = params;

    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(`${timestamp}\n${nonce}\n${body}\n`);
    return verify.verify(this.config.publicKey, signature, 'base64');
  }

  private processPaymentSuccess(data: PartnerWechatPayTransactionResult) {
    try {
      this.logger.log('处理服务商支付成功业务逻辑', {
        outTradeNo: data.out_trade_no,
        transactionId: data.transaction_id,
        amount: data.amount.total,
        subMchId: data.sub_mchid,
      });

      // 发布支付成功事件
      const paymentSuccessEvent = new PaymentSuccessEvent(
        data.out_trade_no,
        data.transaction_id,
        data.amount.total,
        data.payer.sub_openid || data.payer.sp_openid || '',
      );

      this.eventEmitter.emit('payment.success', paymentSuccessEvent);

      this.logger.log('服务商支付成功事件已发布', {
        outTradeNo: data.out_trade_no,
        transactionId: data.transaction_id,
      });
    } catch (error) {
      this.logger.error('处理服务商支付成功业务逻辑失败', error);
      throw error;
    }
  }
}
