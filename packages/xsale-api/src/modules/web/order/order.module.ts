import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@/entities/order.entity';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { Product } from '@/entities/product.entity';
import { Customer } from '@/entities/customer.entity';
import { MerchantModule } from '../merchant/merchant.module';
import { Merchant } from '@/entities/merchant.entity';
import { PaymentListener } from '@/listeners/payment.listener';
import { WechatPayService } from '@/modules/_common/wechat-pay/wechat-pay.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, Customer, Merchant]),
    MerchantModule,
  ],
  providers: [OrderService, OrderResolver, PaymentListener, WechatPayService],
  exports: [OrderService],
})
export class OrderModule {}
