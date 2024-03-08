import { IsArray, IsNumberString, IsOptional, IsString, IsUrl } from "class-validator";
console.log('CreateSpeciesDto')

export class CreateSpeciesDto {
    @IsString({ message: "name must be a string and name is required" })
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly classification: string;

    @IsOptional()
    @IsString()
    readonly designation: string;

    @IsOptional()
    @IsNumberString()
    readonly average_height: string;
    
    @IsOptional()
    @IsString()
    readonly skin_colors: string;
    
    @IsOptional()
    @IsString()
    readonly hair_colors: string;

    @IsOptional()
    @IsString()
    readonly eye_colors: string;

    @IsOptional()
    @IsNumberString()
    readonly average_lifespan: string;
  
    @IsOptional()
    @IsUrl()
    readonly homeworld: string;
    
    @IsOptional()
    @IsString()
    readonly language: string;

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    readonly people: string[];

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    readonly films: string[];

    @IsOptional()
    @IsUrl()
    @IsString()
    readonly url: string;
}