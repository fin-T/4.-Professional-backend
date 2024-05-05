import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from './../../common/enums/role.enum';

/**
 * A class for checking user access rights to specific routes based on their roles.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Checks if the user possesses the required roles to access the route.
   *
   * @param context The execution context containing request information.
   * @returns A boolean indicating whether access is granted based on user roles.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve the required roles metadata assigned to the route.
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    // Extract the user and their roles from the request object
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) return false;

    // Check if any of the user's roles match the required roles
    return requiredRoles.some((selectedRole) =>
      user.role?.includes(selectedRole),
    );
  }
}
