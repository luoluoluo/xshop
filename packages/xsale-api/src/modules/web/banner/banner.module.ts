import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from '@/entities/banner.entity';
import { BannerService } from './banner.service';
import { BannerResolver } from './banner.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Banner])],
  providers: [BannerService, BannerResolver],
  exports: [BannerService, BannerResolver],
})
export class BannerModule {}
