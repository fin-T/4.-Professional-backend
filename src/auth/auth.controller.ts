import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './../users/users.service';
import { CreateUserDto } from './dto/create_user.dto';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login_user.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login',
  })
  @ApiBody({ type: LoginUserDto, required: false })
  async login(@Body() user: LoginUserDto): Promise<{ access_token: string }> {
    const result = await this.authService.validateUser(
      user.username,
      user.password,
    );
    if (result) {
      const payload = {
        username: user.username,
        role: result.role,
      };
      const access_token = await this.jwtService.signAsync(payload);
      console.log(access_token);
      return { access_token: access_token };
    }
    throw new UnauthorizedException('Invalid credentials.');
  }

  @Post('registration')
  @ApiOperation({
    summary: 'Registeration',
    description: `Role might be "admin" or "user". Admin can all. User can use just get methods.`,
  })
  @ApiBody({ type: CreateUserDto, required: false })
  async register(@Body() user: CreateUserDto) {
    const existingUser = await this.usersService.findOne(user.username);
    if (existingUser) throw new BadRequestException('User already exists');

    await this.usersService.create(user);

    const credentialsForLogin: LoginUserDto = {
      username: user.username,
      password: user.password,
    };
    return await this.login(credentialsForLogin);
  }
}
