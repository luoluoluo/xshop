import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { View } from '@/entities/view.entity';
import { Product } from '@/entities/product.entity';
import { User } from '@/entities/user.entity';
import { Order } from '@/entities/order.entity';
import { AnalyticsService } from './analytics.service';
import { AnalyticsResolver } from './analytics.resolver';
import { AuthModule } from '@/modules/_common/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([View, Product, User, Order])],
  providers: [AnalyticsService, AnalyticsResolver],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
