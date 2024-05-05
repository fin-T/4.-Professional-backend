import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { Films } from './entities/films.entity';
import { FilmsImages } from './entities/filmsImages.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './../people/entities/people.entity';
import { PeopleImages } from './../people/entities/peopleImages.entity';
import { Planets } from './../planets/entities/planets.entity';
import { PlanetsImages } from './../planets/entities/planetsImages.entity';
import { Species } from './../species/entities/species.entity';
import { SpeciesImages } from './../species/entities/speciesImages.entity';
import { Vehicles } from './../vehicles/entities/vehicles.entity';
import { VehiclesImages } from './../vehicles/entities/vehiclesImages.entity';
import { Starships } from './../starships/entities/starships.entity';
import { StarshipsImages } from './../starships/entities/starshipsImages.entity';
import { CommonService } from './../common/common.service';
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
      StarshipsImages,
    ]),
  ],
  providers: [CommonService, FilmsService],
  controllers: [FilmsController],
  exports: [FilmsService, TypeOrmModule],
})
export class FilmsModule {}
