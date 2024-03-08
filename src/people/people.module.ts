import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './entities/people.entity';
import { PeopleImages } from './entities/peopleImages.entity';
import { Films } from 'src/films/entities/films.entity';
import { FilmsImages } from 'src/films/entities/filmsImages.entity';
import { FilmsService } from 'src/films/films.service';
import { Planets } from 'src/planets/entities/planets.entity';
import { PlanetsImages } from 'src/planets/entities/planetsImages.entity';
import { PlanetsService } from 'src/planets/planets.service';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { ItemsServiceImpl } from 'src/items/items.service';
import { Species } from 'src/species/entities/species.entity';
import { SpeciesImages } from 'src/species/entities/speciesImages.entity';
import { SpeciesService } from 'src/species/species.service';
console.log('PeopleModule')

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
    ]),
  ],
  controllers: [
    PeopleController
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
  exports: [
    TypeOrmModule,
  ]
})
export class PeopleModule { }
