import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@/entities/order.entity';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { Merchant } from '@/entities/merchant.entity';
import { User } from '@/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Merchant])],
  providers: [OrderService, OrderResolver],
  exports: [OrderService, OrderResolver],
})
export class OrderModule {}
