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
import { OrderModule as CommonOrderModule } from '@/modules/_common/order/order.module';
import { WechatPayModule } from '@/modules/_common/wechat-pay/wechat-pay.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, Customer, Merchant]),
    MerchantModule,
    CommonOrderModule,
    WechatPayModule,
  ],
  providers: [OrderService, OrderResolver, PaymentListener],
  exports: [OrderService],
})
export class OrderModule {}
