import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionResolver } from './permission.resolver';
import { DiscoveryModule } from '@nestjs/core';
import { AuthModule } from '@/modules/_common/auth/auth.module';

@Module({
  imports: [AuthModule, DiscoveryModule],
  exports: [PermissionService],
  providers: [PermissionService, PermissionResolver],
})
export class PermissionModule {}
