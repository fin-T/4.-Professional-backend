import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Films } from 'src/films/entities/films.entity';
import { FilmsImages } from 'src/films/entities/filmsImages.entity';
import { People } from 'src/people/entities/people.entity';
import { PeopleImages } from 'src/people/entities/peopleImages.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DBService {
    constructor(
        @InjectRepository(People) private readonly peopleRepository: Repository<People>,
        @InjectRepository(Films) private readonly filmsRepository: Repository<Films>,
        @InjectRepository(PeopleImages) private readonly peopleImagesRepository: Repository<PeopleImages>,
        @InjectRepository(FilmsImages) private readonly filmsImagesRepository: Repository<FilmsImages>,
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

    async getFilmsImagesFromDBByUrls(urls: string[]): Promise<FilmsImages[]> {
        try {
            if (urls) {
                let filmsImages: FilmsImages[] = [];
                for (let url of urls) {
                    filmsImages.push(await this.filmsImagesRepository.findOneBy({ url: url }));
                }
                filmsImages = filmsImages.filter((value, index, self) => {
                    return self.indexOf(value) === index;
                });
                return filmsImages;
            }
        } catch (error) {
            console.error('Error getting filmsImages from DB by urls:', error);
        }
    }

    async getPeopleImagesFromDBByUrls(urls: string[]): Promise<PeopleImages[]> {
        try {
            if (urls) {
                let peopleImages: PeopleImages[] = [];
                for (let url of urls) {
                    peopleImages.push(await this.peopleImagesRepository.findOneBy({ url: url }));
                }
                peopleImages = peopleImages.filter((value, index, self) => {
                    return self.indexOf(value) === index;
                });
                return peopleImages;
            }
        } catch (error) {
            console.error('Error getting peopleImages from DB by urls:', error);
        }
    }

    async getPeopleFromDBByUrls(urls: string[]): Promise<People[]> {
        try {
            if (urls) {
                let people: People[] = [];
                for (let url of urls) {
                    people.push(await this.peopleRepository.findOneBy({ url: url }));
                }
                people = people.filter((value, index, self) => {
                    return self.indexOf(value) === index;
                });
                return people;
            }
        } catch (error) {
            console.error('Error getting people from DB by urls:', error);
        }
    }

    async getFilmsFromDBByUrls(urls: string[]): Promise<Films[]> {
        try {
            if (urls) {
                let films: Films[] = [];
                for (let url of urls) {
                    films.push(await this.filmsRepository.findOneBy({ url: url }));
                }
                films = films.filter((value, index, self) => {
                    return self.indexOf(value) === index;
                });
                return films;
            }
        } catch (error) {
            console.error('Error getting films from DB by urls:', error);
        }
    }
}
