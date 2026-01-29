import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import type { Request } from 'express';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest<Request & { user?: unknown }>();
    const maybeUser = req.user as unknown;
    // Basic runtime shape check to avoid unsafe `any` returns
    if (maybeUser && typeof maybeUser === 'object') {
      return maybeUser as User;
    }
    // Fallback: return an empty object casted as User to keep callers typed
    return {} as User;
  },
);
