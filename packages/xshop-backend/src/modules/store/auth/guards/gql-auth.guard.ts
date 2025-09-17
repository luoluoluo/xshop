// auth/gql-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { STORE_JWT_STRATEGY } from '@/constants/jwt-strategy';

@Injectable()
export class GqlAuthGuard extends AuthGuard(STORE_JWT_STRATEGY) {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 首先进行 JWT 认证
    const isAuthenticated = await super.canActivate(context);
    console.log('isAuthenticated', isAuthenticated);
    if (!isAuthenticated) {
      return false;
    }

    return true;
  }
}
