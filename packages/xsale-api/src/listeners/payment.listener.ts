import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentSuccessEvent } from '../events/payment-success.event';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from '@/entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentListener {
  private readonly logger = new Logger(PaymentListener.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  /**
   * 监听支付成功事件
   * @param event 支付成功事件
   */
  @OnEvent('payment.success')
  async handlePaymentSuccess(event: PaymentSuccessEvent): Promise<void> {
    try {
      this.logger.log('收到支付成功事件', {
        outTradeNo: event.outTradeNo,
        transactionId: event.transactionId,
        amount: event.amount,
        openid: event.openid,
      });

      const order = await this.orderRepository.findOne({
        where: { id: event.outTradeNo },
      });

      if (!order) {
        this.logger.error('订单不存在', {
          outTradeNo: event.outTradeNo,
        });
        return;
      }

      // 更新订单状态为已支付
      order.status = OrderStatus.PAID;
      order.paidAt = new Date();
      await this.orderRepository.save(order);

      this.logger.log('订单状态更新成功', {
        outTradeNo: event.outTradeNo,
      });
    } catch (error) {
      this.logger.error('处理支付成功事件失败', error);
      throw error;
    }
  }
}
