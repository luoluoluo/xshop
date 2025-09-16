import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { WechatPayService } from './wechat-pay.service';

describe('WechatPayService', () => {
  let service: WechatPayService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        WECHAT_PAY_KEY: 'test_key',
        WECHAT_PAY_PRIVATE_KEY: 'test_private_key',
        WECHAT_PAY_PUBLIC_KEY: 'test_public_key',
        WECHAT_PAY_MCHID: 'test_mchid',
        WECHAT_APP_ID: 'test_appid',
        WECHAT_PAY_NOTIFY_URL: 'https://example.com/notify',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WechatPayService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<WechatPayService>(WechatPayService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handlePaymentNotify', () => {
    it('should return FAIL when missing required headers', async () => {
      const headers = {};
      const body = 'test body';

      const result = await service.handlePaymentNotify(headers, body);

      expect(result.code).toBe('FAIL');
      expect(result.message).toBe('缺少必要的签名参数');
    });

    it('should return FAIL when signature verification fails', async () => {
      const headers = {
        'wechatpay-timestamp': '1234567890',
        'wechatpay-nonce': 'test_nonce',
        'wechatpay-signature': 'invalid_signature',
        'wechatpay-serial': 'test_serial',
      };
      const body = 'test body';

      // Mock the verifySign method to return false
      jest.spyOn(service as any, 'verifySign').mockResolvedValue(false);

      const result = await service.handlePaymentNotify(headers, body);

      expect(result.code).toBe('FAIL');
      expect(result.message).toBe('签名验证失败');
    });

    it('should handle TRANSACTION.SUCCESS event', async () => {
      const headers = {
        'wechatpay-timestamp': '1234567890',
        'wechatpay-nonce': 'test_nonce',
        'wechatpay-signature': 'valid_signature',
        'wechatpay-serial': 'test_serial',
      };
      const body = JSON.stringify({
        id: 'test_id',
        create_time: '2023-01-01T00:00:00+08:00',
        resource_type: 'encrypt-resource',
        event_type: 'TRANSACTION.SUCCESS',
        summary: '支付成功',
        resource: {
          algorithm: 'AEAD_AES_256_GCM',
          ciphertext: 'test_ciphertext',
          associated_data: 'transaction',
          nonce: 'test_nonce',
        },
      });

      // Mock the verifySign method to return true
      jest.spyOn(service as any, 'verifySign').mockResolvedValue(true);

      // Mock the decipherGcm method
      jest.spyOn(service, 'decipherGcm').mockReturnValue({
        trade_state: 'SUCCESS',
        out_trade_no: 'test_order_123',
        transaction_id: 'test_transaction_123',
        amount: { total: 100 },
      });

      const result = await service.handlePaymentNotify(headers, body);

      expect(result.code).toBe('SUCCESS');
      expect(result.message).toBe('处理成功');
    });

    it('should handle REFUND.SUCCESS event', async () => {
      const headers = {
        'wechatpay-timestamp': '1234567890',
        'wechatpay-nonce': 'test_nonce',
        'wechatpay-signature': 'valid_signature',
        'wechatpay-serial': 'test_serial',
      };
      const body = JSON.stringify({
        id: 'test_id',
        create_time: '2023-01-01T00:00:00+08:00',
        resource_type: 'encrypt-resource',
        event_type: 'REFUND.SUCCESS',
        summary: '退款成功',
        resource: {
          algorithm: 'AEAD_AES_256_GCM',
          ciphertext: 'test_ciphertext',
          associated_data: 'refund',
          nonce: 'test_nonce',
        },
      });

      // Mock the verifySign method to return true
      jest.spyOn(service as any, 'verifySign').mockResolvedValue(true);

      // Mock the decipherGcm method
      jest.spyOn(service, 'decipherGcm').mockReturnValue({
        refund_status: 'SUCCESS',
        out_trade_no: 'test_order_123',
        out_refund_no: 'test_refund_123',
        amount: { refund: 100 },
      });

      const result = await service.handlePaymentNotify(headers, body);

      expect(result.code).toBe('SUCCESS');
      expect(result.message).toBe('处理成功');
    });

    it('should handle unknown event type', async () => {
      const headers = {
        'wechatpay-timestamp': '1234567890',
        'wechatpay-nonce': 'test_nonce',
        'wechatpay-signature': 'valid_signature',
        'wechatpay-serial': 'test_serial',
      };
      const body = JSON.stringify({
        id: 'test_id',
        create_time: '2023-01-01T00:00:00+08:00',
        resource_type: 'encrypt-resource',
        event_type: 'UNKNOWN_EVENT',
        summary: '未知事件',
        resource: {
          algorithm: 'AEAD_AES_256_GCM',
          ciphertext: 'test_ciphertext',
          associated_data: 'unknown',
          nonce: 'test_nonce',
        },
      });

      // Mock the verifySign method to return true
      jest.spyOn(service as any, 'verifySign').mockResolvedValue(true);

      // Mock the decipherGcm method
      jest.spyOn(service, 'decipherGcm').mockReturnValue({});

      const result = await service.handlePaymentNotify(headers, body);

      expect(result.code).toBe('SUCCESS');
      expect(result.message).toBe('未知事件类型，但处理成功');
    });
  });

  describe('decipherGcm', () => {
    it('should throw error when key is missing', () => {
      // Mock config to return empty key
      jest.spyOn(configService, 'get').mockReturnValue('');

      expect(() => {
        service.decipherGcm({
          ciphertext: 'test',
          associated_data: 'test',
          nonce: 'test',
        });
      }).toThrow('缺少key');
    });
  });

  describe('sha256WithRsa', () => {
    it('should throw error when private key is missing', () => {
      // Mock config to return empty private key
      jest.spyOn(configService, 'get').mockReturnValue('');

      expect(() => {
        service.sha256WithRsa('test data');
      }).toThrow('缺少秘钥文件');
    });
  });

  describe('getSN', () => {
    it('should throw error when public key is missing', () => {
      // Mock config to return empty public key
      jest.spyOn(configService, 'get').mockReturnValue('');

      expect(() => {
        service.getSN();
      }).toThrow('缺少公钥');
    });
  });
});
