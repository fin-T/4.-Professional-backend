console.log('Constants');

export const PEOPLE_URL = 'https://swapi.dev/api/people';
export const FILMS_URL = 'https://swapi.dev/api/films';
export const PLANETS_URL = 'https://swapi.dev/api/planets';
export const SPECIES_URL = 'https://swapi.dev/api/species';
export const VEHICLES_URL = 'https://swapi.dev/api/vehicles';
export const STARSHIPS_URL = 'https://swapi.dev/api/starships';
export const SWAPI_URL = 'https://swapi.dev/api';
export const MESSAGE_ABOUT_NONEXISTENT_URLS = 'Элементов по этим ссылкам не существует:';
export const CREATE_DB = 'migrations/create_db.sql';
export const ROOT_URL = 'https://swapi.dev/api';

export const PEOPLE_PROPERTY = ['name', 'height', 'mass', 'hair_color', 'skin_color', 'eye_color', 'birth_year',
    'gender', 'homeworld', 'films', 'species', 'vehicles', 'starships', 'created', 'edited', 'url'];
export const FILMS_PROPERTIES = ["characters", "planets", "starships", "vehicles", "species", "created",
    "edited", "producer", "title", "episode_id", "director", "release_date", "opening_crawl", "url"];
export const PLANETS_PROPERTIES = ["diameter", "rotation_period", "orbital_period", "gravity", "population",
    "climate", "terrain", "surface_water", "created", "edited", "name", "url"];
export const SPECIES_PROPERTIES = ["classification", "designation", "average_height", "average_lifespan",
    "hair_colors", "skin_colors", "eye_colors", "homeworld", "language", "people", "created", "edited", 
    "name", "url"]
