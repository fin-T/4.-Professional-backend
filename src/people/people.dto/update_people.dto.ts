import { IsOptional, IsString } from "class-validator";

export class UpdatePeopleDto {
    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly height: string;

    @IsOptional()
    @IsString()
    readonly mass: string;
    
    @IsOptional()
    @IsString()
    readonly hair_color: string;
    
    @IsOptional()
    @IsString()
    readonly skin_color: string;
    
    @IsOptional()
    @IsString()
    readonly  eye_color: string;
    
    @IsOptional()
    @IsString()
    readonly birth_year: string;
    
    @IsOptional()
    @IsString()
    readonly  gender: string;
    
    @IsOptional()
    @IsString()
    readonly  created: string;
    
    @IsOptional()
    @IsString()
    readonly edited: string;
}