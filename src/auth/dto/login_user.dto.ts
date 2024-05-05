import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * A class for describing a data transfer object for login.
 */
export class LoginUserDto {
  @IsString()
  @ApiProperty({ example: 'roma' })
  username: string;

  @IsString()
  @ApiProperty({ example: 'somePassword1234' })
  password: string;
}
