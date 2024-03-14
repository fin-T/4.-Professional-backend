import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './entities/people.entity';
import { PeopleImages } from './entities/peopleImages.entity';
import { Films } from 'src/films/entities/films.entity';
import { FilmsImages } from 'src/films/entities/filmsImages.entity';
import { Planets } from 'src/planets/entities/planets.entity';
import { PlanetsImages } from 'src/planets/entities/planetsImages.entity';
import { Species } from 'src/species/entities/species.entity';
import { SpeciesImages } from 'src/species/entities/speciesImages.entity';
import { StarshipsImages } from 'src/starships/entities/starshipsImages.entity';
import { Starships } from 'src/starships/entities/starships.entity';
import { Vehicles } from 'src/vehicles/entities/vehicles.entity';
import { VehiclesImages } from 'src/vehicles/entities/vehiclesImages.entity';
import { CommonService } from 'src/common/common.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/exeptionFilters/httpExeptionFilter';
console.log('PeopleModule')

@Module({
  imports: [
    TypeOrmModule.forFeature([
      People,
      PeopleImages,
      Films,
      FilmsImages,
      Planets,
      PlanetsImages,
      Species,
      SpeciesImages,
      Vehicles,
      VehiclesImages,
      Starships,
      StarshipsImages
    ]),
  ],
  controllers: [
    PeopleController
  ],
  providers: [
    CommonService,
    PeopleService
  ],
  exports: [
    PeopleService,
    TypeOrmModule
  ]
})
export class PeopleModule { }
