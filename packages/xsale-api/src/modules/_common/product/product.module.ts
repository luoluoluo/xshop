import { Module } from '@nestjs/common';
import { CommonProductService } from './product.service';

@Module({
  providers: [CommonProductService],
  exports: [CommonProductService],
})
export class CommonProductModule {}
