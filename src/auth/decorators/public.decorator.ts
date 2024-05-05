import { SetMetadata } from '@nestjs/common';

/**
 * Key for metadata that indicates the route is public.
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * The `Public` decorator sets the route metadata to indicate that it is public
 *
 * @returns A decorator function that sets the specified metadata for the route.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
