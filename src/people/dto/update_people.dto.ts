import { ArrayUnique, IsArray, IsNumberString, IsOptional, IsString, IsUrl } from "class-validator";
console.log('UpdatePeopleDto');

export class UpdatePeopleDto {
    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
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
    @ArrayUnique()
    @IsUrl({}, { each: true })
    readonly films: string[];

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsUrl({}, { each: true })
    readonly species: string[];

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsUrl({}, { each: true })
    readonly vehicles: string[];

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsUrl({}, { each: true })
    readonly starships: string[];

    @IsOptional()
    @IsUrl()
    readonly url: string;
}