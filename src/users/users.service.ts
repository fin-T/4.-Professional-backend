import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { User } from './../common/types/types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  /**
   * Creates a new user.
   *
   * @param user The user object containing username and password.
   */
  async create(user: User) {
    try {
      const saltRounds = 11;
      user.password = await bcrypt.hash(user.password, saltRounds);

      await this.usersRepository.save(user);
      console.log('Creating user was succesfully.');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  /**
   * Finds a user by username.
   *
   * @param username The username to search for.
   * @returns The user object if found, otherwise null.
   */
  async findOne(username: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOneBy({ username: username });
    } catch (error) {
      console.error('Error finding user:', error);
    }
  }
}
