import * as x509 from '@fidm/x509';
import { Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as crypto from 'crypto';
import { PaymentSuccessEvent } from '@/events/payment-success.event';

const baseUrl = 'https://api.mch.weixin.qq.com';
const getCertificatesUrl = `${baseUrl}/v3/certificates`;
const transactionsJsapiUrl = `${baseUrl}/v3/pay/transactions/jsapi`;
const refundUrl = `${baseUrl}/v3/refund/domestic/refunds`;
const profitsharingAddReceiversUrl = `${baseUrl}/v3/profitsharing/receivers/add`;
const profitsharingCreateOrdersUrl = `${baseUrl}/v3/profitsharing/orders`;

const authType = 'WECHATPAY2-SHA256-RSA2048';

interface Certificate {
  effective_time: string;
  expire_time: string;
  serial_no: string;
  encrypt_certificate: {
    algorithm: string;
    associated_data: string;
    ciphertext: string;
    nonce: string;
  };
}

export interface PayAmount {
  total: number;
  currency?: string;
}

// 支付者
interface PayPayer {
  openid: string;
}
interface TransactionResponse {
  code?: string;
  message?: string;
  prepay_id: string;
}

export interface TransactionRequest {
  appid?: string;
  mchid?: string;
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

export interface RefundAmount {
  total: number;
  currency: string;
  refund: number;
}

export interface RefundRequest {
  out_refund_no: string;
  amount: RefundAmount;
  out_trade_no: string;
}

export interface RefundResponse {
  code?: string;
  message?: string;
  status: string;
  out_trade_no?: string;
  refund_id?: string;
}

export interface ProfitsharingReceiver {
  type: 'MERCHANT_ID' | 'PERSONAL_OPENID' | 'PERSONAL_SUB_OPENID';
  account: string;
  name?: string;
  relation_type: 'STAFF' | 'PARTNER' | 'USER' | 'SUPPLIER';
}

export interface ProfitsharingAddReceiversRequest
  extends ProfitsharingReceiver {
  appid?: string;
}

export interface ProfitsharingAddReceiversResponse {
  code?: string;
  message?: string;
  status: string;
}

export interface ProfitsharingCreateOrderReceiver {
  type: ProfitsharingReceiver['type'];
  name?: ProfitsharingReceiver['name'];
  account: ProfitsharingReceiver['account'];
  amount: number;
  description: string;
}

export interface ProfitsharingCreateOrdersRequest {
  appid?: string;
  transaction_id: string;
  out_order_no: string;
  receivers: ProfitsharingCreateOrderReceiver[];
  unfreeze_unsplit: boolean;
}

export interface ProfitsharingCreateOrdersResponse {
  code?: string;
  message?: string;
  status: string;
}

// 微信支付回调相关接口
export interface WechatPayNotifyResource {
  algorithm: string;
  ciphertext: string;
  associated_data: string;
  nonce: string;
}

export interface WechatPayNotifyData {
  id: string;
  create_time: string;
  resource_type: string;
  event_type: string;
  summary: string;
  resource: WechatPayNotifyResource;
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

// 解密后的支付结果数据
export interface WechatPayTransactionResult {
  appid: string;
  mchid: string;
  out_trade_no: string;
  transaction_id: string;
  trade_type: string;
  trade_state: string;
  trade_state_desc: string;
  bank_type: string;
  attach: string;
  success_time: string;
  payer: {
    openid: string;
  };
  amount: {
    total: number;
    payer_total: number;
    currency: string;
    payer_currency: string;
  };
}

// 解密后的退款结果数据
export interface WechatPayRefundResult {
  mchid: string;
  out_trade_no: string;
  transaction_id: string;
  out_refund_no: string;
  refund_id: string;
  refund_status: string;
  success_time: string;
  user_received_account: string;
  amount: {
    total: number;
    refund: number;
    payer_total: number;
    payer_refund: number;
  };
}

@Injectable()
export class WechatPayService {
  private readonly logger = new Logger(WechatPayService.name);
  private certificateCache = new Map<string, string>();
  private config: {
    key: string;
    privateKey: string;
    publicKey: string;
    mchId: string;
    appId: string;
    notifyUrl: string;
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.config = {
      key: this.configService.get('WECHAT_PAY_KEY') || '',
      privateKey: this.configService.get('WECHAT_PAY_PRIVATE_KEY') || '',
      publicKey: this.configService.get('WECHAT_PAY_PUBLIC_KEY') || '',
      mchId: this.configService.get('WECHAT_PAY_MCHID') || '',
      appId: this.configService.get('WECHAT_APP_ID') || '',
      notifyUrl: this.configService.get('WECHAT_PAY_NOTIFY_URL') || '',
    };

    // 验证必要配置
    this.validateConfig();
  }

  private validateConfig() {
    const requiredFields = ['key', 'privateKey', 'mchId'];
    const missingFields = requiredFields.filter((field) => !this.config[field]);

    if (missingFields.length > 0) {
      const error = `微信支付配置缺失: ${missingFields.join(', ')}`;
      this.logger.error(error);
      throw new Error(error);
    }

    // 验证私钥格式
    try {
      if (this.config.privateKey) {
        crypto
          .createSign('RSA-SHA256')
          .update('test')
          .sign(this.config.privateKey, 'base64');
      }
    } catch (error) {
      const errorMsg = '微信支付私钥格式错误';
      this.logger.error(errorMsg, { error: error.message });
      throw new Error(errorMsg);
    }

    // 验证商户证书格式（如果配置了的话）
    try {
      if (this.config.publicKey) {
        const certificate = x509.Certificate.fromPEM(
          Buffer.from(this.config.publicKey),
        );
        this.logger.log('商户证书信息', {
          serialNumber: certificate.serialNumber,
          subject: certificate.subject,
          issuer: certificate.issuer,
        });
      }
    } catch (error) {
      this.logger.warn('商户公钥证书格式可能有问题', { error: error.message });
    }

    this.logger.log('微信支付配置验证通过', {
      mchId: this.config.mchId,
      appId: this.config.appId,
      hasPrivateKey: !!this.config.privateKey,
      hasPublicKey: !!this.config.publicKey,
      hasKey: !!this.config.key,
    });
  }

  // 添加初始化方法
  async initialize() {
    this.logger.log('初始化微信支付服务');
    await this.preloadCertificates();
  }

  decipherGcm = <T>({
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
      return decoded as T;
    }
  };

  sha256WithRsa = (data: string): string => {
    if (!this.config.privateKey) throw new Error('缺少秘钥文件');
    return crypto
      .createSign('RSA-SHA256')
      .update(data)
      .sign(this.config.privateKey, 'base64');
  };

  getSN = (): string => {
    if (!this.config.publicKey) throw new Error('缺少公钥');
    const certificate = x509.Certificate.fromPEM(
      Buffer.from(this.config.publicKey),
    );
    return certificate.serialNumber;
  };

  request = async <T>(url: string, init?: RequestInit) => {
    const method = init?.method || 'GET';
    const body = (init?.body as string) || '';
    const nonceStr = Math.random().toString(36).slice(2, 17);
    const timestamp = String(Math.round(new Date().getTime() / 1000));
    const str = `${method}\n${url.replace(baseUrl, '')}\n${timestamp}\n${nonceStr}\n${body}\n`;

    this.logger.log('签名字符串', { str, method, url });

    const signature = this.sha256WithRsa(str);
    const sn = this.getSN();
    const authorization = `${authType} mchid="${this.config.mchId}",nonce_str="${nonceStr}",timestamp="${timestamp}",serial_no="${sn}",signature="${signature}"`;

    const headers = {
      Authorization: authorization,
      'Accept-Language': 'zh-CN',
      'Content-Type': 'application/json',
      'User-Agent': 'WechatPay-APIv3-NodeJS-SDK',
      ...(init?.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...init,
        headers,
      });

      this.logger.log('API请求', {
        url,
        method,
        status: response.status,
        mchId: this.config.mchId,
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
        mchId: this.config.mchId,
      });
      throw error;
    }
  };

  getCertificate = async (serial: string) => {
    // 检查缓存
    if (this.certificateCache.has(serial)) {
      this.logger.log('从缓存获取证书', { serial });
      return this.certificateCache.get(serial);
    }

    try {
      this.logger.log('从API获取证书', { serial });
      const result = await this.request<{ data: Certificate[] }>(
        getCertificatesUrl,
        { method: 'GET' },
      );

      this.logger.log('获取证书API响应', { result, serial });

      // 检查响应是否包含期望的数据结构
      if (!result || !result.data || !Array.isArray(result.data)) {
        this.logger.error('获取证书API响应格式错误', { result, serial });
        throw new Error('获取证书API响应格式错误或data字段缺失');
      }

      // 处理所有证书并缓存
      result.data.forEach((item) => {
        try {
          const decryptCertificate = this.decipherGcm<string>({
            ...item.encrypt_certificate,
          });
          const publicKey = x509.Certificate.fromPEM(
            Buffer.from(decryptCertificate),
          ).publicKey.toPEM();

          // 缓存证书
          this.certificateCache.set(item.serial_no, publicKey);
          this.logger.log('证书已缓存', { serial: item.serial_no });
        } catch (error) {
          this.logger.error('解密证书失败', {
            serial: item.serial_no,
            error: error.message,
          });
        }
      });

      const certificate = this.certificateCache.get(serial);
      if (!certificate) {
        throw new Error(`未找到序列号为 ${serial} 的证书`);
      }

      return certificate;
    } catch (error) {
      this.logger.error('获取证书失败', { error: error.message, serial });
      throw error;
    }
  };

  verifySign = async (params: {
    timestamp: string | number;
    nonce: string;
    body: string;
    signature: string;
    serial: string;
  }) => {
    const { timestamp, nonce, body, signature, serial } = params;
    const publicKey = await this.getCertificate(serial);
    if (!publicKey) {
      throw new Error('平台证书序列号不相符，未找到平台序列号');
    }
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(`${timestamp}\n${nonce}\n${body}\n`);
    return verify.verify(publicKey, signature, 'base64');
  };

  createTransactionsJsapi = async (params: TransactionRequest) => {
    if (!params.appid) params.appid = this.config.appId;
    if (!params.mchid) params.mchid = this.config.mchId;
    if (!params.notify_url) params.notify_url = this.config.notifyUrl;
    const result = await this.request<TransactionResponse>(
      transactionsJsapiUrl,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    );
    if (result.code) {
      this.logger.error({ params, result }, '支付失败');
      throw new Error(result.message);
    }
    const data = {
      appId: params.appid,
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
  };

  refund = async (params: RefundRequest) => {
    const result = await this.request<RefundResponse>(refundUrl, {
      method: 'POST',
      body: JSON.stringify(params),
    });
    if (result.code && result.status !== 'SUCCESS') {
      this.logger.error({ params, result }, '退款失败');
      throw new Error(result.message);
    }
    return result;
  };

  // 添加分账接收方
  profitsharingAddReceivers = async (
    params: ProfitsharingAddReceiversRequest,
  ) => {
    if (!params.appid) params.appid = this.config.appId;
    const result = await this.request<ProfitsharingAddReceiversResponse>(
      profitsharingAddReceiversUrl,
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
  };

  // 创建分账单
  profitsharingCreateOrders = async (
    params: ProfitsharingCreateOrdersRequest,
  ) => {
    if (!params.appid) params.appid = this.config.appId;
    const result = await this.request<ProfitsharingCreateOrdersResponse>(
      profitsharingCreateOrdersUrl,
      {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Wechatpay-Serial': this.getSN() },
      },
    );
    if (result.code && result.status !== 'SUCCESS') {
      this.logger.error({ params, result }, '创建分账单失败');
      throw new Error(result.message);
    }
  };

  /**
   * 处理微信支付回调
   * @param headers 请求头
   * @param body 请求体
   * @returns 处理结果
   */
  handlePaymentNotify = async (
    headers: Record<string, string>,
    body: string,
  ): Promise<WechatPayNotifyResponse> => {
    try {
      // 验证签名
      const timestamp = headers['wechatpay-timestamp'];
      const nonce = headers['wechatpay-nonce'];
      const signature = headers['wechatpay-signature'];
      const serial = headers['wechatpay-serial'];

      if (!timestamp || !nonce || !signature || !serial) {
        this.logger.error('缺少必要的签名参数', { headers });
        return { code: 'FAIL', message: '缺少必要的签名参数' };
      }

      // 验证签名
      const isValid = await this.verifySign({
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
      this.logger.log('收到微信支付回调', { notifyData });

      // 解密资源数据
      const decryptedData = this.decipherGcm<any>(notifyData.resource);

      // 根据事件类型处理不同的回调
      switch (notifyData.event_type) {
        case 'TRANSACTION.SUCCESS':
          return this.handleTransactionSuccess(decryptedData);
        default:
          this.logger.warn('未知的事件类型', {
            eventType: notifyData.event_type,
          });
          return { code: 'SUCCESS', message: '未知事件类型，但处理成功' };
      }
    } catch (error) {
      this.logger.error('处理微信支付回调失败', error);
      return { code: 'FAIL', message: '处理失败' };
    }
  };

  /**
   * 处理支付成功回调
   */
  private handleTransactionSuccess = (data: WechatPayTransactionResult) => {
    try {
      this.logger.log('处理支付成功回调', { data });

      // 验证支付状态
      if (data.trade_state !== 'SUCCESS') {
        this.logger.warn('支付状态不是成功', { tradeState: data.trade_state });
        return { code: 'SUCCESS', message: '支付状态不是成功，但处理完成' };
      }

      this.processPaymentSuccess(data);

      return { code: 'SUCCESS', message: '处理成功' };
    } catch (error) {
      this.logger.error('处理支付成功回调失败', error);
      return { code: 'FAIL', message: '处理支付成功回调失败' };
    }
  };

  /**
   * 处理支付成功的业务逻辑
   */
  private processPaymentSuccess = (data: WechatPayTransactionResult) => {
    try {
      this.logger.log('处理支付成功业务逻辑', {
        outTradeNo: data.out_trade_no,
        transactionId: data.transaction_id,
        amount: data.amount.total,
      });

      // 发布支付成功事件
      const paymentSuccessEvent = new PaymentSuccessEvent(
        data.out_trade_no,
        data.transaction_id,
        data.amount.total,
        data.payer.openid,
      );

      this.eventEmitter.emit('payment.success', paymentSuccessEvent);

      this.logger.log('支付成功事件已发布', {
        outTradeNo: data.out_trade_no,
        transactionId: data.transaction_id,
      });
    } catch (error) {
      this.logger.error('处理支付成功业务逻辑失败', error);
    }
  };

  // 添加预加载证书的方法
  private async preloadCertificates() {
    try {
      this.logger.log('开始预加载证书');
      const result = await this.request<{ data: Certificate[] }>(
        getCertificatesUrl,
        { method: 'GET' },
      );

      if (result?.data?.length) {
        result.data.forEach((item) => {
          try {
            const decryptCertificate = this.decipherGcm<string>({
              ...item.encrypt_certificate,
            });
            const publicKey = x509.Certificate.fromPEM(
              Buffer.from(decryptCertificate),
            ).publicKey.toPEM();
            this.certificateCache.set(item.serial_no, publicKey);
          } catch (error) {
            this.logger.error('预加载证书失败', {
              serial: item.serial_no,
              error: error.message,
            });
          }
        });
        this.logger.log('证书预加载完成', {
          count: this.certificateCache.size,
        });
      }
    } catch (error) {
      this.logger.warn('证书预加载失败，将在需要时获取', {
        error: error.message,
      });
    }
  }
}
