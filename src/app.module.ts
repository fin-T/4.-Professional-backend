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
import { PlanetsModule } from './planets/planets.module';
import { PlanetsController } from './planets/planets.controller';
import { PlanetsService } from './planets/planets.service';
import { Planets } from './planets/entities/planets.entity';
import { PlanetsImages } from './planets/entities/planetsImages.entity';
import { SpeciesModule } from './species/species.module';
import { Species } from './species/entities/species.entity';
import { SpeciesImages } from './species/entities/speciesImages.entity';
import { SpeciesController } from './species/species.controller';
import { SpeciesService } from './species/species.service';
import { VehiclesModule } from './vehicles/vehicles.module';
import { StarshipsModule } from './starships/starships.module';
import { VehiclesController } from './vehicles/vehicles.controller';
import { StarshipsController } from './starships/starships.controller';
import { Starships } from './starships/entities/starships.entity';
import { StarshipsImages } from './starships/entities/starshipsImages.entity';
import { Vehicles } from './vehicles/entities/vehicles.entity';
import { VehiclesImages } from './vehicles/entities/vehiclesImages.entity';
import { StarshipsService } from './starships/starships.service';
import { VehiclesService } from './vehicles/vehicles.service';
import { CommonService } from './common/common.service';

console.log('AppModule');

@Module({
  imports: [
    // For using .env
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
        FilmsImages,
        Planets,
        PlanetsImages,
        Species,
        SpeciesImages,
        Vehicles,
        VehiclesImages,
        Starships,
        StarshipsImages
      ],
      synchronize: true
    }),
    PeopleModule,
    FilmsModule,
    PlanetsModule,
    SpeciesModule,
    VehiclesModule,
    StarshipsModule
  ],
  controllers: [
    PeopleController,
    FilmsController,
    PlanetsController,
    SpeciesController, 
    VehiclesController,
    StarshipsController
  ],
  providers: [
    CommonService,
    PeopleService,
    FilmsService,
    SpeciesService,
    PlanetsService,
    VehiclesService,
    StarshipsService
  ],
  exports:[
    AppModule
  ]
})
export class AppModule { }
