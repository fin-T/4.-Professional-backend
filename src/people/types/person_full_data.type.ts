import { Films } from "src/films/entities/films.entity";
import { PeopleImages } from "../entities/peopleImages.entity";

export type PersonShortData = {
    name: string;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
    films: string[] | Films[];
    url: string;
    images: PeopleImages[] | string[];
}