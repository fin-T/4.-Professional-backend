import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

/**
 * Decorator to set method access roles.
 * 
 * @param roles Method access roles.
 * @returns A metadata decorator function.
 */
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);