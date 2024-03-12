import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from 'src/people/entities/people.entity';
import { PeopleImages } from 'src/people/entities/peopleImages.entity';
import { Films } from 'src/films/entities/films.entity';
import { FilmsImages } from 'src/films/entities/filmsImages.entity';
import { Planets } from 'src/planets/entities/planets.entity';
import { PlanetsImages } from 'src/planets/entities/planetsImages.entity';
import { Species } from './entities/species.entity';
import { SpeciesImages } from './entities/speciesImages.entity';
import { Starships } from 'src/starships/entities/starships.entity';
import { StarshipsImages } from 'src/starships/entities/starshipsImages.entity';
import { Vehicles } from 'src/vehicles/entities/vehicles.entity';
import { VehiclesImages } from 'src/vehicles/entities/vehiclesImages.entity';
import { CommonService } from 'src/common/common.service';
console.log('SpeciesModule')

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
      StarshipsImages,
    ])
  ],
  providers: [
    CommonService,
    SpeciesService
  ],
  controllers: [
    SpeciesController
  ],
  exports: [
    SpeciesModule,
    TypeOrmModule
  ]
})
export class SpeciesModule { }
