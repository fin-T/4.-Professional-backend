import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
console.log('CreateStarshipsDto');
export class CreateStarshipsDto {
  @IsString({ message: 'name must be a string and name is required' })
  @ApiProperty({ example: 'BBB' })
  readonly name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'AAA' })
  readonly model: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Lin & Co' })
  readonly manufacturer: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '100' })
  readonly cost_in_credits: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '2' })
  readonly length: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '500' })
  readonly max_atmosphering_speed: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '4' })
  readonly crew: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '0' })
  readonly passengers: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '80' })
  readonly cargo_capacity: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2 month' })
  readonly consumables: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '2.0' })
  readonly hyperdrive_rating: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'unknown' })
  readonly MGLT: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'starcar' })
  readonly starship_class: string;

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
  readonly pilots: string[];

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
  @ApiProperty({ example: 'https://swapi.py4e.com/api/starships/1/' })
  readonly url: string;
}
