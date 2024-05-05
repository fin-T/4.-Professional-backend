import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * A class for describing a data transfer object for creating a new user/admin.
 */
export class CreateUserDto {
  @IsString()
  @ApiProperty({ example: 'roma' })
  username: string;

  @IsString()
  @ApiProperty({ example: 'somePassword1234' })
  password: string;

  @IsString()
  @ApiProperty({ example: 'admin' })
  role: string;
}
