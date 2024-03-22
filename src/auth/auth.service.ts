import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcrypt';

/**
 * Service responsible for user authentication
 */
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  /**
   * Validate user credentials
   * 
   * @param username Username.
   * @param pass Password.
   * @returns Object with field "username" or null if unvalidate user.
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && bcrypt.compare(pass, user.password)) {
      let { password, ...result } = user;
      return result;
    }
    return null;
  }
}