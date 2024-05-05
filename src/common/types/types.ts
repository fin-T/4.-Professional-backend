import { CreateFilmsDto } from './../..//films/dto/create_films.dto';
import { UpdateFilmsDto } from './../..//films/dto/update_films.dto';
import { Films } from './../..//films/entities/films.entity';
import { FilmsImages } from './../..//films/entities/filmsImages.entity';
import { FilmsService } from './../..//films/films.service';
import { CreatePeopleDto } from './../..//people/dto/create_people.dto';
import { UpdatePeopleDto } from './../..//people/dto/update_people.dto';
import { People } from './../..//people/entities/people.entity';
import { PeopleImages } from './../..//people/entities/peopleImages.entity';
import { PeopleService } from './../..//people/people.service';
import { CreatePlanetsDto } from './../..//planets/dto/create_planets.dto';
import { UpdatePlanetsDto } from './../..//planets/dto/update_planets.rto';
import { Planets } from './../..//planets/entities/planets.entity';
import { PlanetsImages } from './../..//planets/entities/planetsImages.entity';
import { PlanetsService } from './../..//planets/planets.service';
import { CreateSpeciesDto } from './../..//species/dto/create_species.dto';
import { UpdateSpeciesDto } from './../..//species/dto/update_spacies.dto';
import { Species } from './../..//species/entities/species.entity';
import { SpeciesImages } from './../..//species/entities/speciesImages.entity';
import { SpeciesService } from './../..//species/species.service';
import { CreateStarshipsDto } from './../..//starships/dto/create_starships.dto';
import { UpdateStarshipsDto } from './../..//starships/dto/update_starships.dto';
import { Starships } from './../..//starships/entities/starships.entity';
import { StarshipsImages } from './../..//starships/entities/starshipsImages.entity';
import { StarshipsService } from './../..//starships/starships.service';
import { CreateVehiclesDto } from './../..//vehicles/dto/create_vehicles.dto';
import { UpdateVehiclesDto } from './../..//vehicles/dto/update_vehicles.dto';
import { Vehicles } from './../..//vehicles/entities/vehicles.entity';
import { VehiclesImages } from './../..//vehicles/entities/vehiclesImages.entity';
import { VehiclesService } from './../..//vehicles/vehicles.service';
console.log('Types');

export type OneOfItems =
  | People
  | Films
  | Planets
  | Species
  | Vehicles
  | Starships;

export type OneOfAllTypes =
  | People
  | Films
  | Planets
  | Species
  | Vehicles
  | Starships
  | PeopleImages
  | FilmsImages
  | PlanetsImages
  | SpeciesImages
  | VehiclesImages
  | StarshipsImages;

export type OneOfUpdateItemsDto =
  | UpdatePeopleDto
  | UpdateFilmsDto
  | UpdatePlanetsDto
  | UpdateSpeciesDto
  | UpdateVehiclesDto
  | UpdateStarshipsDto;

export type AllCreateItemsDto = CreatePeopleDto &
  CreateFilmsDto &
  CreatePlanetsDto &
  CreateSpeciesDto &
  CreateVehiclesDto &
  CreateStarshipsDto;

export type OneOfCreateItemsDto =
  | CreatePeopleDto
  | CreateFilmsDto
  | CreatePlanetsDto
  | CreateSpeciesDto
  | CreateVehiclesDto
  | CreateStarshipsDto;

export type OneOfItemImages =
  | PeopleImages
  | FilmsImages
  | PlanetsImages
  | SpeciesImages
  | VehiclesImages
  | StarshipsImages;

export type OneOfTypeOfItemImages =
  | typeof PeopleImages
  | typeof FilmsImages
  | typeof PlanetsImages
  | typeof SpeciesImages
  | typeof VehiclesImages
  | typeof StarshipsImages;

export type OneOfSevices =
  | PeopleService
  | FilmsService
  | PlanetsService
  | SpeciesService
  | VehiclesService
  | StarshipsService;

export type User = { username: string; password: string; role: string };
