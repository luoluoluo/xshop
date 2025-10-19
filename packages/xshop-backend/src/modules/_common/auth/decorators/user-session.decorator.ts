import { User } from '@/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract Customer from the response locals (HTTP) or context (GraphQL)
 * Must be used with CustomerAuthGuard
 */
export const UserSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User | undefined => {
    const contextType = ctx.getType();

    if (contextType === 'http') {
      // HTTP context
      const response = ctx.switchToHttp().getResponse();
      return response.locals.customer;
    } else {
      // GraphQL context
      const gqlContext = ctx.getArgs()[2];
      return gqlContext?.customer;
    }
  },
);
