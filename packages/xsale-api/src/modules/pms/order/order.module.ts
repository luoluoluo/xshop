import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@/entities/order.entity';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { Merchant } from '@/entities/merchant.entity';
import { User } from '@/entities/user.entity';
import { OrderModule as CommonOrderModule } from '@/modules/_common/order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, Merchant]),
    CommonOrderModule,
  ],
  providers: [OrderService, OrderResolver],
  exports: [OrderService, OrderResolver],
})
export class OrderModule {}
