import { Module } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { SpeciesController } from './species.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from 'src/people/entities/people.entity';
import { PeopleImages } from 'src/people/entities/peopleImages.entity';
import { Films } from 'src/films/entities/films.entity';
import { FilmsImages } from 'src/films/entities/filmsImages.entity';
import { Planets } from 'src/planets/entities/planets.entity';
import { PlanetsImages } from 'src/planets/entities/planetsImages.entity';
import { Species } from './entities/species.entity';
import { SpeciesImages } from './entities/speciesImages.entity';
import { PeopleService } from 'src/people/people.service';
import { FilmsService } from 'src/films/films.service';
import { PlanetsService } from 'src/planets/planets.service';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { ItemsServiceImpl } from 'src/items/items.service';
console.log('SpeciesModule')

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
      SpeciesImages
    ])
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
    SpeciesController
  ],
  exports: [
    TypeOrmModule
  ]
})
export class SpeciesModule { }
