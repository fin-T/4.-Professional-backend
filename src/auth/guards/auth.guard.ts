import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Class for authorizing users when accessing protected resources, using the jwt token.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService, // Injecting JwtService to handle JWT operations
    private reflector: Reflector, // Injecting Reflector to retrieve route metadata
  ) {}

  /**
   * Checks if the route is public or requires authentication.
   *
   * @param context The execution context containing request information.
   * @returns A boolean indicating whether access is granted or not.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Checking if the route is public or requires authentication based on route metadata
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // Extracting token from the request header
    const request = await context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      // Verifying the token using JwtService
      const secret = process.env.JWT_CONSTANT;
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });

      // Storing token payload in request for future use
      request['user'] = payload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
    return true;
  }

  /**
   * Extracts token from Authorization header of the request.
   *
   * @param request The incoming HTTP request.
   * @returns The extracted JWT token if present, otherwise undefined.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
