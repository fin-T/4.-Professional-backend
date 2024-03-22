import { IsArray, IsUrl, Matches } from "class-validator";
console.log('ImagesDto');
/**
 * Data transfer object (DTO) for image URLs.
 */
export class ImagesDto {
    @IsArray()
    @IsUrl({}, { each: true })
    @Matches(/\.(jpg|jpeg|png|gif)$/, {
        each: true,
        message: "Incorrect image url (supported image formats: jpg, jpeg, png, gif)."
    })
    urls: string[];
}