// auth/gql-auth.guard.ts
import {
  ArgumentsHost,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { User } from '@/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getJwtSecret } from '@/config/auth.config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserAuthGuard implements CanActivate {
  private readonly logger = new Logger(UserAuthGuard.name);
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('Admin Guard activated');
    // Get request object based on context type
    const request = this.getRequest(context);
    if (!request) {
      this.logger.warn('❌ No request object found');
      throw new UnauthorizedException('No request object found');
    }

    this.logger.log(`📝 Request headers: ${JSON.stringify(request.headers)}`);

    // Extract the JWT token from the Authorization header
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn('❌ No authorization header found');
      throw new UnauthorizedException('No authorization header found');
    }

    const token = authHeader.substring(7);
    if (!token) {
      this.logger.warn('❌ No token found in authorization header');
      throw new UnauthorizedException('No token found');
    }
    this.logger.log(`✅ Token found: ${token.substring(0, 50)}...`);

    // Verify and decode the JWT token
    this.logger.log('🔑 Verifying JWT token...');
    let payload;
    try {
      payload = this.jwtService.verify(token, {
        secret: getJwtSecret(this.configService),
      });
      this.logger.log('✅ JWT token verified successfully');
    } catch (error) {
      this.logger.error(`❌ Failed to verify JWT token: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!payload || !payload.sub) {
      this.logger.warn('❌ Invalid token payload');
      throw new UnauthorizedException('Invalid token payload');
    }

    this.logger.log(`📋 Token payload: ${JSON.stringify(payload)}`);

    // Extract customer ID from token
    const userId = payload.sub;

    // Load the customer from the database
    this.logger.log(`🔍 Loading user from database: ${userId}`);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { roles: true },
    });

    if (!user) {
      this.logger.warn(`❌ User not found for ID: ${userId}`);
      throw new UnauthorizedException('User not found');
    }

    this.storeUserInContext(context, user);

    // 获取路由上的权限要求
    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
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
      ?.filter((role) => role.isActive)
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

  private storeUserInContext(context: ExecutionContext, user: User): void {
    const contextType = context.getType();

    if (contextType === 'http') {
      // Store in HTTP response.locals
      const ctx = context.switchToHttp();
      const response = ctx.getResponse<Response>();
      if (!response?.locals?.user) {
        response.locals.user = {};
      }
      response.locals.user = user;
    } else {
      // Store in GraphQL context
      const gqlContext = context.getArgs()[2];
      if (gqlContext) {
        if (!gqlContext.customer) {
          gqlContext.customer = {};
        }
        gqlContext.customer = user;
      }
    }
  }

  private getRequest(
    context: ExecutionContext | ArgumentsHost,
  ): Request | undefined {
    try {
      const contextType = context.getType();
      this.logger.debug(`Context type: ${contextType}`);

      if (contextType === 'http') {
        return context.switchToHttp().getRequest<Request>();
      } else {
        // For GraphQL or other contexts, try to get request from args
        const gqlContext = context.getArgs()[2];
        return gqlContext?.req;
      }
    } catch (error) {
      this.logger.error(
        `Error getting request from context: ${error instanceof Error ? error.message : String(error)}`,
      );
      return undefined;
    }
  }
}
