import { EntityMetadata } from "typeorm";
import { People } from "../entities/people.entity";
import { PeopleImages } from "../entities/peopleImages.entity";
import { Films } from "./../../films/entities/films.entity";
import { ImagesDto } from "./../../common/dto/images.dto";

/**
 * Mock person image for tests.
 */
export const MOCK_IMAGE : PeopleImages = {
    id: 1,
    url: 'https://upload.wikimedia.org/phone.png',
    people: new People()
}

/**
 * Mock film for tests.
 */
export const MOCK_FILM: Films = {
    id: 1,
    title: "New World",
    episode_id: 1,
    opening_crawl: "some crawl...",
    director: "Piter Joseph",
    producer: "Json Gabriel",
    release_date: "12.12.2021",
    characters: [],
    planets: [],
    starships: [],
    vehicles: [],
    species: [],
    created: "",
    edited: "",
    url: "https://swapi.py4e.com/api/films/1/",
    images: []
}

/**
 * Mock person for tests.
 */
export const MOCK_PERSON: People = {
    id: 1,
    name: "Roma",
    height: "182",
    mass: "72",
    hair_color: "black",
    skin_color: "white",
    eye_color: "green-brown",
    birth_year: "18.12.2023",
    gender: "male",
    homeworld: null,
    films: [MOCK_FILM],
    species: [],
    vehicles: [],
    starships: [],
    created: "2014-12-09T13:50:51.644000Z",
    edited: "2014-12-09T13:50:51.644000Z",
    url: "https://swapi.py4e.com/api/people/1/",
    images: [MOCK_IMAGE]
}

/**
 * Mock person for tests, where data about items are there urls.
 */
export const MOCK_SHORT_PERSON_DATA = {
    id: 1,
    name: "Roma",
    height: "182",
    mass: "72",
    hair_color: "black",
    skin_color: "white",
    eye_color: "green-brown",
    birth_year: "18.12.2023",
    gender: "male",
    homeworld: null,
    films: ["https://swapi.py4e.com/api/films/1/"],
    species: [],
    vehicles: [],
    starships: [],
    created: "2014-12-09T13:50:51.644000Z",
    edited: "2014-12-09T13:50:51.644000Z",
    url: "https://swapi.py4e.com/api/people/1/",
    images: ['https://upload.wikimedia.org/phone.png']
} 

/**
 * Metadata mock (people relation mock).
 */
export const MOCK_METADATA = {
    relations: [
        { propertyName: 'films' },
        { propertyName: 'homeworld' },
        { propertyName: 'species' },
        { propertyName: 'starships' },
        { propertyName: 'vehicles' },
    ]
} as jest.Mocked<EntityMetadata>;

/**
 * Images mock (Images relation mock).
 */
export const MOCK_IMAGES: ImagesDto = {
    urls: ['https://upload.wikimedia.org/phone.png']
};
