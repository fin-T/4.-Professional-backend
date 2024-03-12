import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { Films } from './entities/films.entity';
import { FilmsImages } from './entities/filmsImages.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from 'src/people/entities/people.entity';
import { PeopleImages } from 'src/people/entities/peopleImages.entity';
import { Planets } from 'src/planets/entities/planets.entity';
import { PlanetsImages } from 'src/planets/entities/planetsImages.entity';
import { Species } from 'src/species/entities/species.entity';
import { SpeciesImages } from 'src/species/entities/speciesImages.entity';
import { Vehicles } from 'src/vehicles/entities/vehicles.entity';
import { VehiclesImages } from 'src/vehicles/entities/vehiclesImages.entity';
import { Starships } from 'src/starships/entities/starships.entity';
import { StarshipsImages } from 'src/starships/entities/starshipsImages.entity';
import { CommonService } from 'src/common/common.service';
console.log('FilmsModule');

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Films,
      FilmsImages,
      People,
      PeopleImages,
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
    FilmsService
  ],
  controllers: [
    FilmsController
  ],
  exports: [
    FilmsModule,
    TypeOrmModule
  ]
})
export class FilmsModule { }
