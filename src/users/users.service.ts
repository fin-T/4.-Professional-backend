import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { User } from 'src/common/types/types';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>
  ) { }

  async create(user: User) {
    try {
      let saltRounds = 11;
      user.password = await bcrypt.hash(user.password, saltRounds);

      await this.usersRepository.save(user);
      console.log("Creating user was succesfully.")
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  async findOne(username: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOneBy({ username: username });
    } catch (error) {
      console.error('Error finding user:', error);
    }
  }
}