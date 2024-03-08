import { CreateFilmsDto } from "src/films/dto/create_films.dto"
import { UpdateFilmsDto } from "src/films/dto/update_films.dto"
import { Films } from "src/films/entities/films.entity"
import { FilmsImages } from "src/films/entities/filmsImages.entity"
import { FilmsDataForResponse } from "src/films/types/film_data_forResponse.type"
import { ItemsServiceImpl } from "src/items/items.service"
import { CreatePeopleDto } from "src/people/dto/create_people.dto"
import { UpdatePeopleDto } from "src/people/dto/update_people.dto"
import { People } from "src/people/entities/people.entity"
import { PeopleImages } from "src/people/entities/peopleImages.entity"
import { PeopleDataForResponse } from "src/people/types/person_data_for_response.type"
import { CreatePlanetsDto } from "src/planets/dto/create_planets.dto"
import { UpdatePlanetsDto } from "src/planets/dto/update_planets.rto"
import { Planets } from "src/planets/entities/planets.entity"
import { PlanetsImages } from "src/planets/entities/planetsImages.entity"
import { PlanetsDataForResponse } from "src/planets/types/planets_data_for_response"
import { CreateSpeciesDto } from "src/species/dto/create_species.dto"
import { UpdateSpeciesDto } from "src/species/dto/update_spacies.dto"
import { Species } from "src/species/entities/species.entity"
import { SpeciesImages } from "src/species/entities/speciesImages.entity"
import { SpeciesDataForResponse } from "src/species/types/species_data_for_response.type"
console.log('Types');

export type OneOfItemTypes = People | Films | Planets | Species;

export type ItemTypes = People & Films & Planets & Species;

export type OneOfAllTypes = People | Films | Planets | Species | PeopleImages |
    FilmsImages | PlanetsImages | SpeciesImages;

export type OneOfResponseTypes = FilmsDataForResponse | PeopleDataForResponse |
    PlanetsDataForResponse | SpeciesDataForResponse;

export type OneOfUpdateItemsDto = UpdatePeopleDto | UpdateFilmsDto | UpdatePlanetsDto | UpdateSpeciesDto;

export type AllCreateItemsDto = CreatePeopleDto & CreateFilmsDto & CreatePlanetsDto & CreateSpeciesDto;

export type OneOfCreateItemsDto = CreatePeopleDto | CreateFilmsDto | CreatePlanetsDto | CreateSpeciesDto;

export type OneOfItemImagesTypes = PeopleImages | FilmsImages | PlanetsImages | SpeciesImages;

export type ItemImagesTypes = PeopleImages & FilmsImages & PlanetsImages & SpeciesImages;

export type OneOfItemTypeArray = PeopleImages[] | FilmsImages[] | PlanetsImages[] | SpeciesImages[];

export type TypeOfItemImageTypes = typeof PeopleImages | typeof FilmsImages | typeof PlanetsImages |
    typeof SpeciesImages;