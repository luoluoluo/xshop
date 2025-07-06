import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@/entities/order.entity';
import { Product } from '@/entities/product.entity';
import { CommonOrderService } from './order.service';
import { WechatPayModule } from '../wechat-pay/wechat-pay.module';
import { Affiliate } from '@/entities/affiliate.entity';
import { Merchant } from '@/entities/merchant.entity';
import { WechatOAuth } from '@/entities/wechat-oauth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Product,
      Affiliate,
      Merchant,
      WechatOAuth,
    ]),
    WechatPayModule,
  ],
  providers: [CommonOrderService],
  exports: [CommonOrderService],
})
export class OrderModule {}
