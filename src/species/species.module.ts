import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './../people/entities/people.entity';
import { PeopleImages } from './../people/entities/peopleImages.entity';
import { Films } from './../films/entities/films.entity';
import { FilmsImages } from './../films/entities/filmsImages.entity';
import { Planets } from './../planets/entities/planets.entity';
import { PlanetsImages } from './../planets/entities/planetsImages.entity';
import { Species } from './entities/species.entity';
import { SpeciesImages } from './entities/speciesImages.entity';
import { Starships } from './../starships/entities/starships.entity';
import { StarshipsImages } from './../starships/entities/starshipsImages.entity';
import { Vehicles } from './../vehicles/entities/vehicles.entity';
import { VehiclesImages } from './../vehicles/entities/vehiclesImages.entity';
import { CommonService } from './../common/common.service';
console.log('SpeciesModule');

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
    ]),
  ],
  providers: [CommonService, SpeciesService],
  controllers: [SpeciesController],
  exports: [SpeciesService, TypeOrmModule],
})
export class SpeciesModule {}
