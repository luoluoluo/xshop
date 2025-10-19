import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from '@/entities/link.entity';
import { LinkService } from './link.service';
import { LinkResolver } from './link.resolver';
import { AuthModule } from '@/modules/_common/auth/auth.module';
@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Link])],
  providers: [LinkService, LinkResolver],
  exports: [LinkService],
})
export class LinkModule {}
