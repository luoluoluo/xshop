import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Order } from '@/entities/order.entity';
import { TaskService } from './task.service';
import { createTypeOrmConfig } from '@/core/type-orm.config';
import { ConfigModule } from '@nestjs/config';
import { Product } from '@/entities/product.entity';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(createTypeOrmConfig()),
    TypeOrmModule.forFeature([Order, Product]),
    ScheduleModule.forRoot(),
    OrderModule,
  ],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
