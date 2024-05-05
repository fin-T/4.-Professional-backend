import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
console.log('CreateVehiclesDto');
export class CreateVehiclesDto {
  @IsString({ message: 'name must be a string and name is required' })
  @ApiProperty({ example: 'Tachka' })
  readonly name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'JJ' })
  readonly model: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Zavod Hata' })
  readonly manufacturer: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '40' })
  readonly cost_in_credits: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '3' })
  readonly length: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '30' })
  readonly max_atmosphering_speed: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '4' })
  readonly crew: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '2' })
  readonly passengers: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '100' })
  readonly cargo_capacity: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2 year' })
  readonly consumables: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'comfort' })
  readonly vehicle_class: string;

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
  @ApiProperty({ example: 'https://swapi.py4e.com/api/vehicles/1/' })
  readonly url: string;
}
