import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

/**
 * Service responsible for user authentication.
 */
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  /**
   * Validate user credentials
   *
   * @param username Username.
   * @param pass Password.
   * @returns Object with field "username" or null if unvalidate user.
   */
  async validateUser(
    username: string,
    pass: string,
  ): Promise<{ user: string; role: string } | null> {
    const user = await this.usersService.findOne(username);
    if (user && bcrypt.compare(pass, user.password)) {
      const result = {
        user: user.username,
        role: user.role,
      };
      return result;
    }
    return null;
  }
}
