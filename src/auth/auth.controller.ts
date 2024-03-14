import { Controller, Post, UseGuards, UseFilters, Body, BadRequestException } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { UsersService } from 'src/users/users.service';
import { HttpExceptionFilter } from 'src/exeptionFilters/httpExeptionFilter';
import { CreateUserDto } from './dto/create_user.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
    constructor(
        private usersService: UsersService
    ) { }

    @Post('login')
    @ApiOperation({
        summary: 'Login',
        description: `To log in, you need to pass the request body like this:

    Example request: \n
    {
    "username": "someLogin",
    "password": "somePassword"
    }
        `
    })
    @ApiBody({ type: CreateUserDto, required: false })
    @UseGuards(LocalAuthGuard)
    @UseFilters(HttpExceptionFilter)
    async login(@Body() user: CreateUserDto) {
        return { user: user.username };
    }

    @Post('registration')
    @ApiOperation({
        summary: 'Registeration',
        description: `To registration, you need to pass the request body like this:
        
    Example request: \n
    {
    "username": "someLogin",
    "password": "somePassword"
    }
        `
    })
    @ApiBody({ type: CreateUserDto, required: false })
    @UseFilters(HttpExceptionFilter)
    async register(@Body() user: CreateUserDto) {
        let existingUser = await this.usersService.findOne(user.username);
        if (existingUser) throw new BadRequestException('User already exists');

        await this.usersService.create(user);

        return await this.login(user);
    }
}