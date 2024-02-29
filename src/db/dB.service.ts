import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Films } from 'src/films/entities/films.entity';
import { People } from 'src/people/entities/people.entity';
import { Repository } from 'typeorm';

console.log('dbService')

@Injectable()
export class DBService {
    constructor(
        @InjectRepository(People) private readonly peopleRepository: Repository<People>,
        @InjectRepository(Films) private readonly filmsRepository: Repository<Films>,
        // @InjectRepository(Planet) private readonly planetRepository: Repository<Planet>,
        // @InjectRepository(Specie) private readonly specieRepository: Repository<Specie>,
        // @InjectRepository(Starship) private readonly starshipRepository: Repository<Starship>,
        // @InjectRepository(Vehicle) private readonly vehicleRepository: Repository<Vehicle>,
    ) { }

    // async getVehicles(vehiclesData: (Vehicle[] | string[])) {
    //     let vehiclesFromDb = await this.vehicleRepository.find();
    //     if (vehiclesData) {
    //         let vehicles: Vehicle[] = [];
    //         for (let vehicleData of vehiclesData) {
    //             if (typeof vehicleData === 'string') {
    //                 if (vehicleData.charAt(vehicleData.length - 1) !== '/') vehicleData += '/';
    //                 let matchedVehicle = vehiclesFromDb.find(vehicleFromDB => vehicleFromDB.url === vehicleData);
    //                 if (matchedVehicle) vehicles.push(matchedVehicle);
    //             } else if (vehicleData) {
    //                 let vehicleDataAsVehicle = vehicleData as Vehicle;
    //                 let matchedVehicle = vehiclesFromDb.find(vehicleFromDB => vehicleFromDB.name === vehicleDataAsVehicle.name);
    //                 if (matchedVehicle) vehicles.push(matchedVehicle);
    //             }
    //         }
    //         vehicles = vehicles.filter((value, index, self) => {
    //             return self.indexOf(value) === index;
    //         });
    //         return vehicles;
    //     }
    // }

    // async getPlanets(planetsData: (Planet[] | string[])): Promise<Planet[]> {
    //     let planetsFromDb = await this.planetRepository.find();
    //     if (planetsData) {
    //         let planets: Planet[] = [];
    //         for (let planetData of planetsData) {
    //             if (typeof planetData === 'string') {
    //                 if (planetData.charAt(planetData.length - 1) !== '/') planetData += '/';
    //                 let matchedPlanet = planetsFromDb.find(planetFromDB => planetFromDB.url === planetData);
    //                 if (matchedPlanet) planets.push(matchedPlanet);
    //             } else if (planetData) {
    //                 let planetDataAsPlanet = planetData as Planet;
    //                 let matchedPlanet = planetsFromDb.find(planetFromDB => planetFromDB.name === planetDataAsPlanet.name);
    //                 if (matchedPlanet) planets.push(matchedPlanet);
    //             }
    //         }
    //         planets = planets.filter((value, index, self) => {
    //             return self.indexOf(value) === index;
    //         });
    //         return planets;
    //     }
    // }

    // async getStarships(starshipsData: (Starship[] | string[])) {
    //     let starshipsFromDb = await this.starshipRepository.find();
    //     if (starshipsData) {
    //         let starships: Starship[] = [];
    //         for (let starshipData of starshipsData) {
    //             if (typeof starshipData === 'string') {
    //                 if (starshipData.charAt(starshipData.length - 1) !== '/') starshipData += '/';
    //                 let matchedStarship = starshipsFromDb.find(starshipFromDB => starshipFromDB.url === starshipData);
    //                 if (matchedStarship) starships.push(matchedStarship);
    //             } else if (starshipData) {
    //                 let starshipDataAsStarship = starshipData as Starship;
    //                 let matchedStarship = starshipsFromDb.find(starshipFromDB => {
    //                     starshipFromDB.name === starshipDataAsStarship.name
    //                 });
    //                 if (matchedStarship) starships.push(matchedStarship);
    //             }
    //         }
    //         starships = starships.filter((value, index, self) => {
    //             return self.indexOf(value) === index;
    //         });
    //         return starships;
    //     }
    // }

    // async getSpecies(speciesData: (Specie[] | string[])) {
    //     let speciesFromDb = await this.specieRepository.find();
    //     if (speciesData) {
    //         let species: Specie[] = [];
    //         for (let specieData of speciesData) {
    //             if (typeof specieData === 'string') {
    //                 if (specieData.charAt(specieData.length - 1) !== '/') specieData += '/';
    //                 let matchedSpecie = speciesFromDb.find(specieFromDB => specieFromDB.url === specieData);
    //                 if (matchedSpecie) species.push(matchedSpecie);
    //             } else if (specieData) {
    //                 let specieDataAsSpecie = specieData as Specie;
    //                 let matchedSpecie = speciesFromDb.find(specieFromDB => specieFromDB.name === specieDataAsSpecie.name);
    //                 if (matchedSpecie) species.push(matchedSpecie);
    //             }
    //         }
    //         species = species.filter((value, index, self) => {
    //             return self.indexOf(value) === index;
    //         });
    //         return species;
    //     }
    // }

    async getPeople(peopleData: (People[] | string[])) {
        let peopleFromDb = await this.peopleRepository.find();
        if (peopleData) {
            let people: People[] = [];
            for (let personData of peopleData) {
                if (typeof personData === 'string') {
                    if (personData.charAt(personData.length - 1) !== '/') personData += '/';
                    let matchedPerson = peopleFromDb.find(personFromDB => personFromDB.url === personData);
                    if (matchedPerson) people.push(matchedPerson);
                } else if (personData) {
                    let personDataAsPerson = personData as People;
                    let matchedPerson = peopleFromDb.find(personFromDB => personFromDB.name === personDataAsPerson.name);
                    if (matchedPerson) people.push(matchedPerson);
                }
            }
            people = people.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
            return people;
        }
    }

    async getFilms(filmsData: (Films[] | string[])) {
        let filmsFromDb = await this.filmsRepository.find();
        if (filmsData) {
            let films: Films[] = [];
            for (let filmData of filmsData) {
                if (typeof filmData === 'string') {
                    if (filmData.charAt(filmData.length - 1) !== '/') filmData += '/';
                    let matchedFilm = filmsFromDb.find(filmFromDB => filmFromDB.url === filmData);
                    if (matchedFilm) films.push(matchedFilm);
                } else if (filmData) {
                    let filmDataAsFilm = filmData as Films;
                    let matchedFilm = filmsFromDb.find(filmFromDB => filmFromDB.title === filmDataAsFilm.title);
                    if (matchedFilm) films.push(matchedFilm);
                }
            }
            films = films.filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
            return films;
        }
    }
}
