import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@/entities/order.entity';
import { Product } from '@/entities/product.entity';
import { CommonOrderService } from './order.service';
import { WechatPayModule } from '../wechat-pay/wechat-pay.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product]), WechatPayModule],
  providers: [CommonOrderService],
  exports: [CommonOrderService],
})
export class OrderModule {}
