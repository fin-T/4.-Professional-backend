import { Films } from "src/films/entities/films.entity";
import { Planets } from "src/planets/entities/planets.entity";
import { PeopleImages } from "../entities/peopleImages.entity";
import { Species } from "src/species/entities/species.entity";
console.log('PeopleDataForResponse')
export type PeopleDataForResponse = {
    name: string;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
    homeworld: string;
    films: string[];
    species: string[];
    url: string;
    images: string[];
}