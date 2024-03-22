import { IsString } from "class-validator";

/**
 * A class for describing a data transfer object for creating a new user.
 */
export class CreateUserDto {
    @IsString()
    username: string;

    @IsString()
    password: string;
}