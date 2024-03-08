import { IsArray, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUrl } from "class-validator";
console.log('CreatePeopleDto');

export class CreatePeopleDto {
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumberString()
    readonly height: string;

    @IsOptional()
    @IsNumberString()
    readonly mass: string;

    @IsOptional()
    @IsString()
    readonly hair_color: string;

    @IsOptional()
    @IsString()
    readonly skin_color: string;

    @IsOptional()
    @IsString()
    readonly eye_color: string;

    @IsOptional()
    @IsString()
    readonly birth_year: string;

    @IsOptional()
    @IsString()
    readonly gender: string;

    @IsOptional()
    @IsUrl()
    readonly homeworld: string;

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    readonly films: string[];

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    readonly species: string[];

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    readonly vehicles: string[];

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    readonly starships: string[];

    @IsOptional()
    @IsUrl()
    @IsString()
    readonly url: string;
}