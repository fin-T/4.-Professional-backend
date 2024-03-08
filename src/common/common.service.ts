import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Films } from 'src/films/entities/films.entity';
import { FilmsImages } from 'src/films/entities/filmsImages.entity';
import { UpdatePeopleDto } from 'src/people/dto/update_people.dto';
import { People } from 'src/people/entities/people.entity';
import { PeopleImages } from 'src/people/entities/peopleImages.entity';
import { Planets } from 'src/planets/entities/planets.entity';
import { PlanetsImages } from 'src/planets/entities/planetsImages.entity';
import { Repository } from 'typeorm';
import { ItemTypes, OneOfAllTypes, OneOfItemImagesTypes, OneOfItemTypes } from './types/types';
import { Species } from 'src/species/entities/species.entity';
import { SpeciesImages } from 'src/species/entities/speciesImages.entity';
import { FILMS_PROPERTIES, PEOPLE_PROPERTY, PLANETS_PROPERTIES, SPECIES_PROPERTIES } from './constants';

@Injectable()
export class CommonService {
    constructor(
        @InjectRepository(People) private readonly peopleRepository: Repository<People>,
        @InjectRepository(Films) private readonly filmsRepository: Repository<Films>,
        @InjectRepository(PeopleImages) private readonly peopleImagesRepository: Repository<PeopleImages>,
        @InjectRepository(FilmsImages) private readonly filmsImagesRepository: Repository<FilmsImages>,
        @InjectRepository(Planets) private readonly planetsRepository: Repository<Planets>,
        @InjectRepository(PlanetsImages) private readonly planetsImagesRepository: Repository<PlanetsImages>,
        @InjectRepository(Species) private readonly speciesRepository: Repository<Species>,
        @InjectRepository(SpeciesImages) private readonly speciesImagesRepository: Repository<SpeciesImages>,
        // @InjectRepository(Vehicles) private readonly vehiclesRepository: Repository<Vehicles>,
        // @InjectRepository(VehiclesImagesRepository) private readonly vehiclesImagesRepository: 
        // Repository<VehiclesImages>,
        // @InjectRepository(Starships) private readonly starshipsRepository: Repository<Starships>,
        // @InjectRepository(StarshipsImages) private readonly starshipsImagesRepository: Repository<StarshipsImages>
    ) { }

    async getItemsByUrls(item: OneOfAllTypes, urls: string[]) {
        try {
            const ItemRepositoriesMap: {
                [key: string]: Repository<OneOfItemTypes> |
                Repository<OneOfItemImagesTypes>
            } = {
                People: this.peopleRepository,
                PeopleService: this.peopleImagesRepository,
                Films: this.filmsRepository,
                FilmsImages: this.filmsImagesRepository,
                Planets: this.planetsRepository,
                PlanetsImages: this.planetsImagesRepository,
                Species: this.speciesRepository,
                SpeciesImages: this.speciesImagesRepository,
                // Veicles: this.vehiclesRepository,
                // VehiclesImages: this.vehiclesImagesRepository,
                // Starships: this.starshipsRepository,
                // StarshipsImages: this.starshipsImagesRepository,
            }

            let constructorName = item.constructor.name;
            let repository = ItemRepositoriesMap[constructorName];

            let items = [];
            if (urls && urls.length > 0) {
                for (let url of urls) {
                    let foundItems = await repository.findBy({ url: url });
                    if (foundItems && foundItems.length > 0) {
                        items = items.concat(...await repository.findBy({ url: url }));
                    }
                }
            }
            return items;
        } catch (error) {
            console.error('Error getting items by urls:', error);
        }
    }

    async getSpecieImagesFromDBByUrls(urls: string[]): Promise<SpeciesImages[]> {
        try {
            if (urls) {
                let planetsImages: SpeciesImages[] = [];
                for (let url of urls) {
                    planetsImages.push(await this.speciesImagesRepository.findOneBy({ url: url }));
                }
                return planetsImages;
            }
        } catch (error) {
            console.error('Error getting planet images from DB by urls:', error);
        }
    }

    async getSpecieFromDBByUrls(urls?: string[]): Promise<Species[]> {
        try {
            if (urls) {
                let planets: Species[] = [];
                for (let url of urls) {
                    planets.push(await this.speciesRepository.findOneBy({ url: url }));
                }
                return planets;
            }
        } catch (error) {
            console.error('Error getting planets from DB by urls:', error);
        }
    }

    async getPlanetsImagesFromDBByUrls(urls: string[]): Promise<PlanetsImages[]> {
        try {
            if (urls) {
                let planetsImages: PlanetsImages[] = [];
                for (let url of urls) {
                    planetsImages.push(await this.planetsImagesRepository.findOneBy({ url: url }));
                }
                return planetsImages;
            }
        } catch (error) {
            console.error('Error getting planet images from DB by urls:', error);
        }
    }

    async getPlanetsFromDBByUrls(urls?: string[]): Promise<Planets[]> {
        try {
            if (urls) {
                let planets: Planets[] = [];
                for (let url of urls) {
                    planets.push(await this.planetsRepository.findOneBy({ url: url }));
                }
                return planets;
            }
        } catch (error) {
            console.error('Error getting planets from DB by urls:', error);
        }
    }

    async getFilmsImagesFromDBByUrls(urls: string[]): Promise<FilmsImages[]> {
        try {
            if (urls) {
                let filmsImages: FilmsImages[] = [];
                for (let url of urls) {
                    filmsImages.push(await this.filmsImagesRepository.findOneBy({ url: url }));
                }
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
                return people;
            }
        } catch (error) {
            console.error('Error getting people from DB by urls:', error);
        }
    }

    async getPersonFullData(personToUpdate: People, updatedData?: UpdatePeopleDto): Promise<OneOfItemTypes> {
        console.log(updatedData);
        personToUpdate.homeworld = updatedData.homeworld ?
            (await this.getPlanetsFromDBByUrls([updatedData.homeworld]) as Planets[])[0] : null;
        personToUpdate.films = updatedData.films ?
            await this.getFilmsFromDBByUrls(updatedData.films) as Films[] : null;

        return personToUpdate;
    }

    async getFilmsFromDBByUrls(urls: string[]): Promise<Films[]> {
        try {
            if (urls) {
                let films: Films[] = [];
                for (let url of urls) {
                    films.push(await this.filmsRepository.findOneBy({ url: url }));
                }
                return films;
            }
        } catch (error) {
            console.error('Error getting films from DB by urls:', error);
        }
    }
}
