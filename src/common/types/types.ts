import { CreateFilmsDto } from "src/films/dto/create_films.dto"
import { UpdateFilmsDto } from "src/films/dto/update_films.dto"
import { Films } from "src/films/entities/films.entity"
import { FilmsImages } from "src/films/entities/filmsImages.entity"
import { FilmsService } from "src/films/films.service"
import { CreatePeopleDto } from "src/people/dto/create_people.dto"
import { UpdatePeopleDto } from "src/people/dto/update_people.dto"
import { People } from "src/people/entities/people.entity"
import { PeopleImages } from "src/people/entities/peopleImages.entity"
import { PeopleService } from "src/people/people.service"
import { CreatePlanetsDto } from "src/planets/dto/create_planets.dto"
import { UpdatePlanetsDto } from "src/planets/dto/update_planets.rto"
import { Planets } from "src/planets/entities/planets.entity"
import { PlanetsImages } from "src/planets/entities/planetsImages.entity"
import { PlanetsService } from "src/planets/planets.service"
import { CreateSpeciesDto } from "src/species/dto/create_species.dto"
import { UpdateSpeciesDto } from "src/species/dto/update_spacies.dto"
import { Species } from "src/species/entities/species.entity"
import { SpeciesImages } from "src/species/entities/speciesImages.entity"
import { SpeciesService } from "src/species/species.service"
import { CreateStarshipsDto } from "src/starships/dto/create_starships.dto"
import { UpdateStarshipsDto } from "src/starships/dto/update_starships.dto"
import { Starships } from "src/starships/entities/starships.entity"
import { StarshipsImages } from "src/starships/entities/starshipsImages.entity"
import { StarshipsService } from "src/starships/starships.service"
import { CreateVehiclesDto } from "src/vehicles/dto/create_vehicles.dto"
import { UpdateVehiclesDto } from "src/vehicles/dto/update_vehicles.dto"
import { Vehicles } from "src/vehicles/entities/vehicles.entity"
import { VehiclesImages } from "src/vehicles/entities/vehiclesImages.entity"
import { VehiclesService } from "src/vehicles/vehicles.service"
console.log('Types');

export type OneOfItems = People | Films | Planets | Species | Vehicles | Starships;

export type OneOfAllTypes = People | Films | Planets | Species | Vehicles | Starships | PeopleImages |
    FilmsImages | PlanetsImages | SpeciesImages | VehiclesImages | StarshipsImages;

export type OneOfUpdateItemsDto = UpdatePeopleDto | UpdateFilmsDto | UpdatePlanetsDto | UpdateSpeciesDto |
    UpdateVehiclesDto | UpdateStarshipsDto;

export type AllCreateItemsDto = CreatePeopleDto & CreateFilmsDto & CreatePlanetsDto & CreateSpeciesDto &
    CreateVehiclesDto & CreateStarshipsDto;

export type OneOfCreateItemsDto = CreatePeopleDto | CreateFilmsDto | CreatePlanetsDto | CreateSpeciesDto |
    CreateVehiclesDto | CreateStarshipsDto;

export type OneOfItemImages = PeopleImages | FilmsImages | PlanetsImages | SpeciesImages | VehiclesImages |
    StarshipsImages;

export type OneOfTypeOfItemImages = typeof PeopleImages | typeof FilmsImages | typeof PlanetsImages |
    typeof SpeciesImages | typeof VehiclesImages | typeof StarshipsImages;

export type OneOfSevices = PeopleService | FilmsService | PlanetsService | SpeciesService | VehiclesService |
    StarshipsService;

export type User = { username: string, password: string };
