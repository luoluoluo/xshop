import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { View } from '@/entities/view.entity';
import { Product } from '@/entities/product.entity';
import { User } from '@/entities/user.entity';
import { Order } from '@/entities/order.entity';
import { AnalyticsService } from './analytics.service';
import { AnalyticsResolver } from './analytics.resolver';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([View, Product, User, Order])],
  providers: [AnalyticsService, AnalyticsResolver, GqlAuthGuard],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
