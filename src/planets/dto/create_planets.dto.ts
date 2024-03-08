import { IsArray, IsNumberString, IsOptional, IsString, IsUrl } from "class-validator";
console.log('CreatePlanetsDto')
export class CreatePlanetsDto {
    @IsString({ message: "name must be a string and name is required" })
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
    @IsUrl({}, { each: true })
    readonly residents: string[];
    
    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    readonly films: string[];

    @IsOptional()
    @IsArray()
    @IsUrl({}, { each: true })
    readonly species: string[];
    
    @IsOptional()
    @IsUrl()
    @IsString()
    readonly url: string;
}

