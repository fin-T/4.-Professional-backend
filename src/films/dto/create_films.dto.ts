import { IsArray, IsNumberString, IsOptional, IsString, IsUrl } from "class-validator";
import { IsDateFormat } from "src/validators/isDateFormat";
console.log('CreateFilmsDto');

export class CreateFilmsDto {
    @IsString({ message: "title must be a string and title is required" })
    readonly title: string;

    @IsOptional()
    @IsNumberString()
    readonly episode_id: number;

    @IsOptional()
    @IsString()
    readonly opening_crawl: string;

    @IsOptional()
    @IsString()
    readonly director: string;

    @IsOptional()
    @IsString()
    readonly producer: string;

    @IsOptional()
    @IsString()
    @IsDateFormat()
    readonly release_date: string;

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    readonly characters: string[];

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    readonly planets: string[];

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    readonly starships: string[];

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    readonly vehicles: string[];

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    readonly species: string[];
    
    @IsOptional()
    @IsUrl()
    @IsString()
    readonly url: string;
}