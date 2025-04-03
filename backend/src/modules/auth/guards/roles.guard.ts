import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../common/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    console.log('User from request:', user);
    if (typeof user.role === 'string') {
      return requiredRoles.includes(user.role);
    }
  
    // If user.role is an array (multiple roles), check if any match
    if (Array.isArray(user.role)) {
      return user.role.some((role) => requiredRoles.includes(role));
    }

    return false;
  }
} 