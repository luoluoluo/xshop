import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';

@Injectable()
export class PermissionService implements OnModuleInit {
  private permissions: Set<string> = new Set();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.discover();
  }

  private discover() {
    const providers = this.discoveryService.getProviders();
    providers.forEach((wrapper) => {
      const { instance } = wrapper;
      if (!instance) return;
      const prototype = Object.getPrototypeOf(instance);
      if (!prototype) return;

      const methods = this.metadataScanner.getAllMethodNames(prototype);

      methods.forEach((methodName) => {
        const method = prototype[methodName];
        if (typeof method !== 'function') return;

        const permission = this.reflector.get<string>('permission', method);

        if (permission) {
          this.permissions.add(permission);
        }
      });
    });
  }

  findAll(): string[] {
    return Array.from(this.permissions);
  }
}
