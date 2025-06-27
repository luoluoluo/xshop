import { Test, TestingModule } from '@nestjs/testing';
import { WechatPayController } from './wechat-pay.controller';
import { WechatPayService } from './wechat-pay.service';

describe('WechatPayController', () => {
  let controller: WechatPayController;
  let service: WechatPayService;

  const mockWechatPayService = {
    handlePaymentNotify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WechatPayController],
      providers: [
        {
          provide: WechatPayService,
          useValue: mockWechatPayService,
        },
      ],
    }).compile();

    controller = module.get<WechatPayController>(WechatPayController);
    service = module.get<WechatPayService>(WechatPayService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handlePaymentNotify', () => {
    it('should handle payment notification successfully', async () => {
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

      const expectedResult = { code: 'SUCCESS', message: '处理成功' };
      mockWechatPayService.handlePaymentNotify.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.handlePaymentNotify(headers, body);

      expect(service.handlePaymentNotify).toHaveBeenCalledWith(headers, body);
      expect(result).toEqual(expectedResult);
    });

    it('should handle service errors gracefully', async () => {
      const headers = {};
      const body = 'test body';

      const error = new Error('Service error');
      mockWechatPayService.handlePaymentNotify.mockRejectedValue(error);

      const result = await controller.handlePaymentNotify(headers, body);

      expect(result.code).toBe('FAIL');
      expect(result.message).toBe('处理异常');
    });

    it('should log request information', async () => {
      const headers = {
        'wechatpay-timestamp': '1234567890',
        'wechatpay-nonce': 'test_nonce',
        'wechatpay-signature': 'valid_signature',
        'wechatpay-serial': 'test_serial',
      };
      const body = 'test body';

      const expectedResult = { code: 'SUCCESS', message: '处理成功' };
      mockWechatPayService.handlePaymentNotify.mockResolvedValue(
        expectedResult,
      );

      // Spy on logger
      const loggerSpy = jest.spyOn(controller['logger'], 'log');

      await controller.handlePaymentNotify(headers, body);

      expect(loggerSpy).toHaveBeenCalledWith('收到微信支付回调请求', {
        headers: {
          'wechatpay-timestamp': '1234567890',
          'wechatpay-nonce': 'test_nonce',
          'wechatpay-signature': 'valid_signature',
          'wechatpay-serial': 'test_serial',
        },
        bodyLength: body.length,
      });

      expect(loggerSpy).toHaveBeenCalledWith('微信支付回调处理完成', {
        result: expectedResult,
      });
    });

    it('should log error when service throws exception', async () => {
      const headers = {};
      const body = 'test body';

      const error = new Error('Service error');
      mockWechatPayService.handlePaymentNotify.mockRejectedValue(error);

      // Spy on logger
      const loggerSpy = jest.spyOn(controller['logger'], 'error');

      await controller.handlePaymentNotify(headers, body);

      expect(loggerSpy).toHaveBeenCalledWith('微信支付回调处理异常', error);
    });
  });
});
