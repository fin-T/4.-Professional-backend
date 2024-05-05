import { FilmsImages } from './../../films/entities/filmsImages.entity';
import { PeopleImages } from './../../people/entities/peopleImages.entity';
import { PlanetsImages } from './../../planets/entities/planetsImages.entity';
import { SpeciesImages } from './../../species/entities/speciesImages.entity';
import { StarshipsImages } from './../../starships/entities/starshipsImages.entity';
import { VehiclesImages } from './../../vehicles/entities/vehiclesImages.entity';

console.log('Constants');
// Urls for routes.
export const ROOT_URL: string = 'https://swapi.py4e.com/api';
export const PEOPLE_URL: string = 'https://swapi.py4e.com/api/people/';
export const FILMS_URL: string = 'https://swapi.py4e.com/api/films/';
export const PLANETS_URL: string = 'https://swapi.py4e.com/api/planets/';
export const SPECIES_URL: string = 'https://swapi.py4e.com/api/species/';
export const VEHICLES_URL: string = 'https://swapi.py4e.com/api/vehicles/';
export const STARSHIPS_URL: string = 'https://swapi.py4e.com/api/starships/';

/**
 * Exeption message if urls didn't exist.
 */
export const MESSAGE_ABOUT_NONEXISTENT_URLS =
  'There are no items in these urls:';

/**
 * Path to script for create DB.
 */
export const CREATE_DB = 'migrations/create_db.sql';

/**
 * Image class map. Where keys are item constructor names and keys are their image class.
 */
export const IMAGE_CLASS_MAP = {
  People: PeopleImages,
  Films: FilmsImages,
  Planets: PlanetsImages,
  Species: SpeciesImages,
  Vehicles: VehiclesImages,
  Starships: StarshipsImages,
};
