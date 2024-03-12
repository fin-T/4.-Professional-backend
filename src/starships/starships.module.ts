import { Module } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { StarshipsController } from './starships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Films } from 'src/films/entities/films.entity';
import { FilmsImages } from 'src/films/entities/filmsImages.entity';
import { People } from 'src/people/entities/people.entity';
import { PeopleImages } from 'src/people/entities/peopleImages.entity';
import { Planets } from 'src/planets/entities/planets.entity';
import { PlanetsImages } from 'src/planets/entities/planetsImages.entity';
import { Species } from 'src/species/entities/species.entity';
import { SpeciesImages } from 'src/species/entities/speciesImages.entity';
import { Starships } from './entities/starships.entity';
import { StarshipsImages } from './entities/starshipsImages.entity';
import { Vehicles } from 'src/vehicles/entities/vehicles.entity';
import { VehiclesImages } from 'src/vehicles/entities/vehiclesImages.entity';
import { CommonService } from 'src/common/common.service';
console.log('StarshipsModule');
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
    StarshipsService,
  ],
  controllers: [
    StarshipsController
  ],
  exports: [
    StarshipsModule,
    TypeOrmModule
  ]
})
export class StarshipsModule { }
