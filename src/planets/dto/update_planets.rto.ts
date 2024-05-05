import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
console.log('UpdatePlanetsDto');

export class UpdatePlanetsDto {
  @IsOptional()
  @ApiProperty({ example: 'Nepalun' })
  readonly name: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '21' })
  readonly rotation_period: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '300' })
  readonly orbital_period: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '10301' })
  readonly diameter: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'warm' })
  readonly climate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '1 standart' })
  readonly gravity: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'jungle' })
  readonly terrain: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '65' })
  readonly surface_water: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '100' })
  readonly population: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUrl({}, { each: true })
  @ApiProperty({
    example: [
      'https://swapi.py4e.com/api/people/1/',
      'https://swapi.py4e.com/api/people/2/',
    ],
  })
  readonly residents: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUrl({}, { each: true })
  @ApiProperty({
    example: [
      'https://swapi.py4e.com/api/films/1/',
      'https://swapi.py4e.com/api/films/2/',
    ],
  })
  readonly films: string[];

  @IsOptional()
  @IsUrl()
  @ApiProperty({ example: 'https://swapi.py4e.com/api/planets/71/' })
  readonly url: string;
}
