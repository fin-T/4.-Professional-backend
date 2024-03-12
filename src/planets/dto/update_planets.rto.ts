import { ArrayUnique, IsArray, IsNumberString, IsOptional, IsString, IsUrl } from "class-validator";
console.log('UpdatePlanetsDto')

export class UpdatePlanetsDto {
    @IsOptional()
    @IsString()
    readonly name: string;
    
    @IsOptional()
    @IsNumberString()
    readonly rotation_period: string;
    
    @IsOptional()
    @IsNumberString()
    readonly orbital_period: string;
    
    @IsOptional()
    @IsNumberString()
    readonly diameter: string;
    
    @IsOptional()
    @IsString()
    readonly climate: string;
    
    @IsOptional()
    @IsString()
    readonly gravity: string;
    
    @IsOptional()
    @IsString()
    readonly terrain: string;
    
    @IsOptional()
    @IsNumberString()
    readonly  surface_water: string;
    
    @IsOptional()
    @IsNumberString()
    readonly population: string;
    
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsUrl({}, { each: true })
    readonly residents: string[];
    
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsUrl({}, { each: true })
    readonly films: string[];
    
    @IsOptional()
    @IsUrl()
    readonly url: string;
}