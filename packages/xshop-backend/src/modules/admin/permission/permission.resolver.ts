import { Resolver, Query } from '@nestjs/graphql';
import { Permission } from './permission.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PermissionService } from './permission.service';
import { camelCase } from 'lodash';

@Resolver()
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}
  @Query(() => [Permission])
  @UseGuards(GqlAuthGuard)
  permissions(@I18n() i18n: I18nContext) {
    const permissions = ['*', ...this.permissionService.findAll()];

    const result: Permission[] = [];
    permissions.map((permission) => {
      const [resource, action] = permission.split('.');
      result.push({
        value: permission,
        resource: i18n.t(
          `permission.resources.${resource === '*' ? '*' : camelCase(resource)}`,
          {
            defaultValue: resource,
          },
        ),
        action: i18n.t(`permission.actions.${camelCase(action)}`, {
          defaultValue: action || '',
        }),
      });
    });

    return result;
  }
}
