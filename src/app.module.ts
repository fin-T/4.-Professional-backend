import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from './people/people.module';
import { PeopleController } from './people/people.controller';
import { PeopleService } from './people/people.service';
import { FilmsModule } from './films/films.module';
import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';
import { People } from './people/entities/people.entity';
import { PeopleImages } from './people/entities/peopleImages.entity';
import { Films } from './films/entities/films.entity';
import { FilmsImages } from './films/entities/filmsImages.entity';
import { DBService } from './db/dB.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.DATABASE,
      entities: [
        People,
        PeopleImages,
        Films,
        FilmsImages
      ],
      synchronize: true
    }),
    PeopleModule,
    FilmsModule
  ],
  controllers: [
    PeopleController,
    FilmsController,
  ],
  providers: [
    DBService,
    PeopleService,
    FilmsService
  ],
})
export class AppModule { }
