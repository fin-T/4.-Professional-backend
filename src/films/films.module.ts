import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { Films } from './entities/films.entity';
import { FilmsImages } from './entities/filmsImages.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from 'src/people/entities/people.entity';
import { PeopleImages } from 'src/people/entities/peopleImages.entity';
import { DBService } from 'src/db/dB.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Films,
      FilmsImages,
      People,
      PeopleImages
    ])
  ],
  providers: [
    DBService,
    FilmsService
  ],
  controllers: [
    FilmsController
  ],
  exports: [
    TypeOrmModule
  ]
})
export class FilmsModule { }
