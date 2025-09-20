import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { View } from '@/entities/view.entity';
import { Product } from '@/entities/product.entity';
import { User } from '@/entities/user.entity';
import { Article } from '@/entities/article.entity';
import { AnalyticsService } from './analytics.service';
import { AnalyticsResolver } from './analytics.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([View, Product, User, Article])],
  providers: [AnalyticsService, AnalyticsResolver],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
