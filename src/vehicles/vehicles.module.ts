import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from 'src/people/entities/people.entity';
import { PeopleImages } from 'src/people/entities/peopleImages.entity';
import { Films } from 'src/films/entities/films.entity';
import { FilmsImages } from 'src/films/entities/filmsImages.entity';
import { Planets } from 'src/planets/entities/planets.entity';
import { PlanetsImages } from 'src/planets/entities/planetsImages.entity';
import { Species } from 'src/species/entities/species.entity';
import { SpeciesImages } from 'src/species/entities/speciesImages.entity';
import { Vehicles } from './entities/vehicles.entity';
import { VehiclesImages } from './entities/vehiclesImages.entity';
import { Starships } from 'src/starships/entities/starships.entity';
import { StarshipsImages } from 'src/starships/entities/starshipsImages.entity';
import { CommonService } from 'src/common/common.service';
console.log('VehiclesModule')
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
  providers: [
    CommonService,
    VehiclesService,
  ],
  controllers: [
    VehiclesController
  ],
  exports: [
    VehiclesService,
    TypeOrmModule
  ]
})
export class VehiclesModule { }
