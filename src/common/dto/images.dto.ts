import { IsArray, IsUrl, Matches } from "class-validator";

export class ImagesDto {
    @IsArray()
    @IsUrl({}, { each: true })
    @Matches(/\.(jpg|jpeg|png|gif)$/, { each: true })
    urls: string[];
}