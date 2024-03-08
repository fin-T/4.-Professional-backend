import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Films } from 'src/films/entities/films.entity';
import { FilmsImages } from 'src/films/entities/filmsImages.entity';
import { People } from 'src/people/entities/people.entity';
import { PeopleImages } from 'src/people/entities/peopleImages.entity';
import { Planets } from 'src/planets/entities/planets.entity';
import { PlanetsImages } from 'src/planets/entities/planetsImages.entity';
import { PlanetsService } from 'src/planets/planets.service';
import { PeopleModule } from 'src/people/people.module';
import { FilmsModule } from 'src/films/films.module';
import { PlanetsModule } from 'src/planets/planets.module';
import { Repository } from 'typeorm';
import { PeopleService } from 'src/people/people.service';
import { FilmsService } from 'src/films/films.service';
import { CommonService } from 'src/common/common.service';
import { ItemsServiceImpl } from './items.service';
import { SpeciesService } from 'src/species/species.service';
import { SpeciesModule } from 'src/species/species.module';
import { Species } from 'src/species/entities/species.entity';
import { SpeciesImages } from 'src/species/entities/speciesImages.entity';
console.log('ItemsModule');

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
        PeopleModule,
        FilmsModule,
        PlanetsModule,
        SpeciesModule,
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
      ],
      exports: [
        TypeOrmModule,
      ]
})
export class ItemsModule {}
