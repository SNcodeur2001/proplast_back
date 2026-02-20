import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles specified, allow access (use JwtAuthGuard for authentication)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get user from request (injected by JwtStrategy via JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If no user, throw unauthorized
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user role is in required roles
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}. Your role: ${user.role}`,
      );
    }

    return true;
  }
}
