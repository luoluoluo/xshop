import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortLink } from '@/entities/short-link.entity';
import { ShortLinkResolver } from './short-link.resolver';
import { ShortLinkService } from './short-link.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShortLink])],
  providers: [ShortLinkResolver, ShortLinkService],
  exports: [ShortLinkService],
})
export class ShortLinkModule {}
