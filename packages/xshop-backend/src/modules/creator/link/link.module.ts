import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from '@/entities/link.entity';
import { LinkService } from './link.service';
import { LinkResolver } from './link.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Link])],
  providers: [LinkService, LinkResolver],
  exports: [LinkService],
})
export class LinkModule {}
