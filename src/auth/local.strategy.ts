import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * A class for implementing the passport-local strategy.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Validates user credentials during local authentication.
   * 
   * @param username Username.
   * @param password Password.
   * @returns User with fields: username, password and his role.
   */
  async validate(username: string, password: string): Promise<any> {
    let user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    user.role = 'admin'
    return user;
  }
}