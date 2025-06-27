import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionResolver } from './permission.resolver';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [DiscoveryModule],
  exports: [PermissionService],
  providers: [PermissionService, PermissionResolver],
})
export class PermissionModule {}
