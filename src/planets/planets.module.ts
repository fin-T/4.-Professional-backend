import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsController } from './planets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsImages } from './../films/entities/filmsImages.entity';
import { Films } from './../films/entities/films.entity';
import { PeopleImages } from './../people/entities/peopleImages.entity';
import { People } from './../people/entities/people.entity';
import { Planets } from './entities/planets.entity';
import { PlanetsImages } from './entities/planetsImages.entity';
import { Species } from './../species/entities/species.entity';
import { SpeciesImages } from './../species/entities/speciesImages.entity';
import { Vehicles } from './../vehicles/entities/vehicles.entity';
import { VehiclesImages } from './../vehicles/entities/vehiclesImages.entity';
import { Starships } from './../starships/entities/starships.entity';
import { StarshipsImages } from './../starships/entities/starshipsImages.entity';
import { CommonService } from './../common/common.service';
console.log('PlanetsModule');

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
      StarshipsImages,
    ]),
  ],
  providers: [CommonService, PlanetsService],
  controllers: [PlanetsController],
  exports: [PlanetsService, TypeOrmModule],
})
export class PlanetsModule {}
