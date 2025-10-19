import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/entities/product.entity';
import { AuthModule } from '@/modules/_common/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Product])],
  providers: [ProductService, ProductResolver],
  exports: [ProductService, ProductResolver],
})
export class ProductModule {}
