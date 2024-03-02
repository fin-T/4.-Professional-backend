import { IsArray, IsNumberString, IsOptional, IsString, IsUrl, Matches } from "class-validator";

export class CreatePeopleDto {
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
    @IsArray()
    @IsUrl({}, { each: true })
    films: string[];

    @IsOptional()
    @IsUrl()
    @IsString()
    readonly url: string;    

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    @Matches(/\.(jpg|jpeg|png|gif)$/, { each: true })
    readonly images: string[];
}