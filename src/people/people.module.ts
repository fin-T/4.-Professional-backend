import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './entities/people.entity';
import { PeopleImages } from './entities/peopleImages.entity';
import { Films } from 'src/films/entities/films.entity';
import { FilmsImages } from 'src/films/entities/filmsImages.entity';
import { DBService } from 'src/db/dB.service';
import { FilmsService } from 'src/films/films.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      People,
      PeopleImages,
      Films,
      FilmsImages
    ])
  ],
  controllers: [
    PeopleController
  ],
  providers: [
    DBService,
    PeopleService,
    FilmsService
  ],
  exports: [
    TypeOrmModule
  ]
})
export class PeopleModule { }
