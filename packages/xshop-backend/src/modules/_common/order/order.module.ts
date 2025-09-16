import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@/entities/order.entity';
import { Product } from '@/entities/product.entity';
import { CommonOrderService } from './order.service';
import { WechatPayModule } from '../wechat-pay/wechat-pay.module';
import { ConfigModule } from '@nestjs/config';
import { User } from '@/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, User]),
    WechatPayModule,
    ConfigModule,
  ],
  providers: [CommonOrderService],
  exports: [CommonOrderService],
})
export class OrderModule {}
