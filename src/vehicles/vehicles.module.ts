import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './../people/entities/people.entity';
import { PeopleImages } from './../people/entities/peopleImages.entity';
import { Films } from './../films/entities/films.entity';
import { FilmsImages } from './../films/entities/filmsImages.entity';
import { Planets } from './../planets/entities/planets.entity';
import { PlanetsImages } from './../planets/entities/planetsImages.entity';
import { Species } from './../species/entities/species.entity';
import { SpeciesImages } from './../species/entities/speciesImages.entity';
import { Vehicles } from './entities/vehicles.entity';
import { VehiclesImages } from './entities/vehiclesImages.entity';
import { Starships } from './../starships/entities/starships.entity';
import { StarshipsImages } from './../starships/entities/starshipsImages.entity';
import { CommonService } from './../common/common.service';
console.log('VehiclesModule');
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
  providers: [CommonService, VehiclesService],
  controllers: [VehiclesController],
  exports: [VehiclesService, TypeOrmModule],
})
export class VehiclesModule {}
