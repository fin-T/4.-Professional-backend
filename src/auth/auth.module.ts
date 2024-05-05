import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'asdas',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthGuard, RolesGuard, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
