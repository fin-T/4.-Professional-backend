import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsController } from './planets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsImages } from 'src/films/entities/filmsImages.entity';
import { Films } from 'src/films/entities/films.entity';
import { PeopleImages } from 'src/people/entities/peopleImages.entity';
import { People } from 'src/people/entities/people.entity';
import { Planets } from './entities/planets.entity';
import { PlanetsImages } from './entities/planetsImages.entity';
import { FilmsService } from 'src/films/films.service';
import { PeopleService } from 'src/people/people.service';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { ItemsServiceImpl } from 'src/items/items.service';
import { Species } from 'src/species/entities/species.entity';
import { SpeciesImages } from 'src/species/entities/speciesImages.entity';
import { SpeciesService } from 'src/species/species.service';
console.log('PlanetsModule')

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
      SpeciesImages
    ]),
  ],
  providers: [
    CommonService,
    ItemsServiceImpl,
    PeopleService,
    FilmsService,
    SpeciesService,
    PlanetsService,
    Repository
  ],
  controllers: [
    PlanetsController
  ],
  exports: [
    TypeOrmModule,
  ]
})
export class PlanetsModule {}
