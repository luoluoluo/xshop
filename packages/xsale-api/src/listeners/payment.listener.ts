import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentSuccessEvent } from '../events/payment-success.event';
import { CommonOrderService } from '../modules/_common/order/order.service';

@Injectable()
export class PaymentListener {
  private readonly logger = new Logger(PaymentListener.name);

  constructor(private readonly orderService: CommonOrderService) {}

  /**
   * 监听支付成功事件
   * @param event 支付成功事件
   */
  @OnEvent('payment.success')
  async handleSuccess(event: PaymentSuccessEvent): Promise<void> {
    try {
      this.logger.log('收到支付成功事件', {
        outTradeNo: event.outTradeNo,
        transactionId: event.transactionId,
        amount: event.amount,
        openid: event.openid,
      });

      await this.orderService.completePayment(
        event.outTradeNo,
        event.transactionId,
      );
    } catch (error) {
      this.logger.error('处理支付成功事件失败', {
        error,
        outTradeNo: event.outTradeNo,
        transactionId: event.transactionId,
        amount: event.amount,
        openid: event.openid,
      });
      throw error;
    }
  }
}
