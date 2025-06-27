// auth/gql-auth.guard.ts
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { CMS_JWT_STRATEGY } from '@/core/constants';

@Injectable()
export class GqlAuthGuard extends AuthGuard(CMS_JWT_STRATEGY) {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('Cms Guard activated');
    // 首先进行 JWT 认证
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    // 获取请求上下文
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user = request.user;

    // 获取路由上的权限要求
    const requiredPermission = this.reflector.get<string>(
      'permission',
      ctx.getHandler(),
    );

    // 如果没有设置权限要求，则允许访问
    if (!requiredPermission) {
      return true;
    }

    // // 解析所需权限
    // const { resource, action } =
    //   this.permissionService.parse(requiredPermission);

    // // 验证权限是否有效
    // const isValidPermission = permissions.some(
    //   (p) => p.resource === resource && p.actions.includes(action),
    // );
    // if (!isValidPermission) {
    //   throw new UnauthorizedException('无效的权限要求');
    // }

    // 检查用户是否有所需权限
    const hasPermission = user.roles
      .filter((role) => role.isActive)
      .some(
        (role) =>
          role.permissions.includes(requiredPermission) ||
          role.permissions.includes('*'),
      );

    if (!hasPermission) {
      throw new ForbiddenException('您没有执行此操作的权限');
    }

    return true;
  }
}
