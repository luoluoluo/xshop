import { Module } from '@nestjs/common';
import { ProductService } from './product/product.service';
import { ProductResolver } from './product/product.resolver';
import { ProductCategoryService } from './product-category/product-category.service';
import { ProductCategoryResolver } from './product-category/product-category.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/entities/product.entity';
import { ProductCategory } from '@/entities/product-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCategory])],
  providers: [
    ProductService,
    ProductResolver,
    ProductCategoryService,
    ProductCategoryResolver,
  ],
  exports: [
    ProductService,
    ProductResolver,
    ProductCategoryService,
    ProductCategoryResolver,
  ],
})
export class ProductModule {}
