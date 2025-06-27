import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@/entities/order.entity';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { Product } from '@/entities/product.entity';
import { Affiliate } from '@/entities/affiliate.entity';
import { MerchantModule } from '../merchant/merchant.module';
import { Merchant } from '@/entities/merchant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, Affiliate, Merchant]),
    MerchantModule,
  ],
  providers: [OrderService, OrderResolver],
  exports: [OrderService],
})
export class OrderModule {}
