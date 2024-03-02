import { IsArray, IsNumberString, IsString, IsUrl } from "class-validator";


export class CreatePeopleFromSWapi {
    @IsString()
    readonly name: string;

    @IsNumberString()
    readonly height: string;

    @IsNumberString()
    readonly mass: string;

    @IsString()
    readonly hair_color: string;

    @IsString()
    readonly skin_color: string;

    @IsString()
    readonly eye_color: string;

    @IsString()
    readonly birth_year: string;

    @IsString()
    readonly gender: string;

    @IsArray()
    @IsUrl({}, { each: true })
    films: string[];

    @IsUrl()
    @IsString()
    url: string;
}