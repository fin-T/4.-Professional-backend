import { Films } from "src/films/entities/films.entity";
import { People } from "src/people/entities/people.entity";
import { Planets } from "src/planets/entities/planets.entity";
import { SpeciesImages } from "../entities/speciesImages.entity";
console.log('SpeciesDataForResponse')

export class SpeciesDataForResponse {
    name: string;
    classification: string;
    designation: string;
    average_height: string;
    skin_colors: string;
    hair_colors: string;
    eye_colors: string;
    average_lifespan: string;
    homeworld: string;
    language: string;
    people: string[];
    films: string[];
    created: string;
    edited: string;
    url: string;
    images: string[];
}