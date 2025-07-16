import { Module } from '@nestjs/common';
import { ProductService } from './product/product.service';
import { ProductResolver } from './product/product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/entities/product.entity';
import { CommonProductModule } from '@/modules/_common/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CommonProductModule],
  providers: [ProductService, ProductResolver],
  exports: [ProductService, ProductResolver],
})
export class ProductModule {}
