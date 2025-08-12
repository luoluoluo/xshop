import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@/entities/order.entity';
import { Product } from '@/entities/product.entity';
import { CommonOrderService } from './order.service';
import { WechatPayModule } from '../wechat-pay/wechat-pay.module';
import { Affiliate } from '@/entities/affiliate.entity';
import { Merchant } from '@/entities/merchant.entity';
import { WechatOAuth } from '@/entities/wechat-oauth.entity';
import { ConfigModule } from '@nestjs/config';

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
    ConfigModule,
  ],
  providers: [CommonOrderService],
  exports: [CommonOrderService],
})
export class OrderModule {}
