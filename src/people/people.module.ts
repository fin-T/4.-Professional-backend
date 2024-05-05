import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './entities/people.entity';
import { PeopleImages } from './entities/peopleImages.entity';
import { Films } from './../films/entities/films.entity';
import { FilmsImages } from './../films/entities/filmsImages.entity';
import { Planets } from './../planets/entities/planets.entity';
import { PlanetsImages } from './../planets/entities/planetsImages.entity';
import { Species } from './../species/entities/species.entity';
import { SpeciesImages } from './../species/entities/speciesImages.entity';
import { StarshipsImages } from './../starships/entities/starshipsImages.entity';
import { Starships } from './../starships/entities/starships.entity';
import { Vehicles } from './../vehicles/entities/vehicles.entity';
import { VehiclesImages } from './../vehicles/entities/vehiclesImages.entity';
import { CommonService } from './../common/common.service';
console.log('PeopleModule');

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
  controllers: [PeopleController],
  providers: [CommonService, PeopleService],
  exports: [PeopleService, TypeOrmModule],
})
export class PeopleModule {}
