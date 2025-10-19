import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@/entities/order.entity';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { AuthModule } from '@/modules/_common/auth/auth.module';
@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Order])],
  providers: [OrderService, OrderResolver],
  exports: [OrderService, OrderResolver],
})
export class OrderModule {}
