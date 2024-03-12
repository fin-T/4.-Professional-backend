import { ArrayUnique, IsArray, IsNumberString, IsOptional, IsString, IsUrl } from "class-validator";
console.log('CreateStarshipsDto')
export class CreateStarshipsDto {
    @IsString({ message: "name must be a string and name is required" })
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly model: string;

    @IsOptional()
    @IsString()
    readonly manufacturer: string;

    @IsOptional()
    @IsNumberString()
    readonly cost_in_credits: string;

    @IsOptional()
    @IsNumberString()
    readonly length: string;

    @IsOptional()
    @IsNumberString()
    readonly max_atmosphering_speed: string;

    @IsOptional()
    @IsNumberString()
    readonly crew: string;

    @IsOptional()
    @IsNumberString()
    readonly passengers: string;

    @IsOptional()
    @IsNumberString()
    readonly cargo_capacity: string;

    @IsOptional()
    @IsString()
    readonly consumables: string;

    @IsOptional()
    @IsNumberString()
    readonly hyperdrive_rating: string;

    @IsOptional()
    @IsString()
    readonly MGLT: string;

    @IsOptional()
    @IsString()
    readonly starship_class: string;

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsUrl({}, { each: true })
    readonly pilots: string[];

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsUrl({}, { each: true })
    readonly films: string[];

    @IsOptional()
    @IsUrl()
    readonly url: string;
}