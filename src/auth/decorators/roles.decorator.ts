import { SetMetadata } from '@nestjs/common';
import { Role } from './../../common/enums/role.enum';

/**
 * Key for metadata that indicates the roles required to access a route.
 */
export const ROLES_KEY = 'roles';

/**
 * The `Roles` decorator sets the route metadata to specify the roles required for access.
 *
 * @param roles The roles required to access the route.
 * @returns A decorator function that sets the specified roles metadata for the route.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
