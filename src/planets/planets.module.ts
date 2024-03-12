import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsController } from './planets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsImages } from 'src/films/entities/filmsImages.entity';
import { Films } from 'src/films/entities/films.entity';
import { PeopleImages } from 'src/people/entities/peopleImages.entity';
import { People } from 'src/people/entities/people.entity';
import { Planets } from './entities/planets.entity';
import { PlanetsImages } from './entities/planetsImages.entity';
import { Species } from 'src/species/entities/species.entity';
import { SpeciesImages } from 'src/species/entities/speciesImages.entity';
import { Vehicles } from 'src/vehicles/entities/vehicles.entity';
import { VehiclesImages } from 'src/vehicles/entities/vehiclesImages.entity';
import { Starships } from 'src/starships/entities/starships.entity';
import { StarshipsImages } from 'src/starships/entities/starshipsImages.entity';
import { CommonService } from 'src/common/common.service';
console.log('PlanetsModule')

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Planets,
      People,
      PeopleImages,
      Films,
      FilmsImages,
      PlanetsImages,
      Species,
      SpeciesImages,
      Vehicles,
      VehiclesImages,
      Starships,
      StarshipsImages
    ]),
  ],
  providers: [
    CommonService,
    PlanetsService
  ],
  controllers: [
    PlanetsController
  ],
  exports: [
    PlanetsModule,
    TypeOrmModule
  ]
})
export class PlanetsModule { }
