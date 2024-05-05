import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from './people/people.module';
import { FilmsModule } from './films/films.module';
import { People } from './people/entities/people.entity';
import { PeopleImages } from './people/entities/peopleImages.entity';
import { Films } from './films/entities/films.entity';
import { FilmsImages } from './films/entities/filmsImages.entity';
import { PlanetsModule } from './planets/planets.module';
import { Planets } from './planets/entities/planets.entity';
import { PlanetsImages } from './planets/entities/planetsImages.entity';
import { SpeciesModule } from './species/species.module';
import { Species } from './species/entities/species.entity';
import { SpeciesImages } from './species/entities/speciesImages.entity';
import { VehiclesModule } from './vehicles/vehicles.module';
import { StarshipsModule } from './starships/starships.module';
import { Starships } from './starships/entities/starships.entity';
import { StarshipsImages } from './starships/entities/starshipsImages.entity';
import { Vehicles } from './vehicles/entities/vehicles.entity';
import { VehiclesImages } from './vehicles/entities/vehiclesImages.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Users } from './users/entities/users.entity';

console.log('AppModule');

@Module({
  imports: [
    // For using .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [
        Users,
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
      ],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    PeopleModule,
    FilmsModule,
    PlanetsModule,
    SpeciesModule,
    VehiclesModule,
    StarshipsModule,
  ],
  exports: [AppModule],
})
export class AppModule {}
