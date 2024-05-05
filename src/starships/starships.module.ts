import { Module } from '@nestjs/common';
import { StarshipsService } from './starships.service';
import { StarshipsController } from './starships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Films } from './../films/entities/films.entity';
import { FilmsImages } from './../films/entities/filmsImages.entity';
import { People } from './../people/entities/people.entity';
import { PeopleImages } from './../people/entities/peopleImages.entity';
import { Planets } from './../planets/entities/planets.entity';
import { PlanetsImages } from './../planets/entities/planetsImages.entity';
import { Species } from './../species/entities/species.entity';
import { SpeciesImages } from './../species/entities/speciesImages.entity';
import { Starships } from './entities/starships.entity';
import { StarshipsImages } from './entities/starshipsImages.entity';
import { Vehicles } from './../vehicles/entities/vehicles.entity';
import { VehiclesImages } from './../vehicles/entities/vehiclesImages.entity';
import { CommonService } from './../common/common.service';
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
      StarshipsImages,
    ]),
  ],
  providers: [CommonService, StarshipsService],
  controllers: [StarshipsController],
  exports: [StarshipsService, TypeOrmModule],
})
export class StarshipsModule {}
