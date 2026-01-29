import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../enums/role.enum';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: unknown }>();
    const user = req?.user;
    if (!user || typeof user !== 'object') return false;
    const maybeRoles = (user as Record<string, unknown>)['roles'];
    if (!Array.isArray(maybeRoles)) return false;
    return requiredRoles.some((role) => maybeRoles.includes(role));
  }
}
