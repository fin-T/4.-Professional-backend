import { IsString, IsNumberString, IsArray, IsUrl } from "class-validator";
import { IsDateFormat } from "src/validators/isDateFormat";

export class CreateFilmsFromSWapi {
    @IsString()
    readonly title: string;

    @IsNumberString()
    readonly episode_id: number;

    @IsString()
    readonly opening_crawl: string;

    @IsString()
    readonly director: string;

    @IsString()
    readonly producer: string;

    @IsString()
    @IsDateFormat()
    readonly release_date: string;

    @IsArray()
    @IsUrl({}, {each: true})
    characters: string[];

    @IsUrl()
    @IsString()
    url: string;
}