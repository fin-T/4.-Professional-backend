import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Films } from './../films/entities/films.entity';
import { FilmsImages } from './../films/entities/filmsImages.entity';
import { People } from './../people/entities/people.entity';
import { PeopleImages } from './../people/entities/peopleImages.entity';
import { Planets } from './../planets/entities/planets.entity';
import { PlanetsImages } from './../planets/entities/planetsImages.entity';
import { Repository } from 'typeorm';
import {
  OneOfAllTypes,
  OneOfCreateItemsDto,
  OneOfItemImages,
  OneOfItems,
  OneOfUpdateItemsDto,
} from './types/types';
import { Species } from './../species/entities/species.entity';
import { SpeciesImages } from './../species/entities/speciesImages.entity';
import { StarshipsImages } from './../starships/entities/starshipsImages.entity';
import { VehiclesImages } from './../vehicles/entities/vehiclesImages.entity';
import { Starships } from './../starships/entities/starships.entity';
import { Vehicles } from './../vehicles/entities/vehicles.entity';

/**
 * Class for interacting with entities of certain item structures (People, Films, Planets,
 * Species, Vehicles, Starships) and with image entities of database items, respectively (PeopleImages,
 * FilmsImages, PlanetsImages, SpeciesImages, VehiclesImages, StarshipsImages).
 */
@Injectable()
export class CommonService {
  /**
   * Constructor for initializing repositories.
   *
   * @param peopleRepository A repository for interacting with person entities.
   * @param peopleImagesRepository A repository for interacting with people image entities.
   * @param filmsRepository A repository for interacting with film entities.
   * @param filmsImagesRepository A repository for interacting with film image entities.
   * @param planetsRepository Repository for interacting with planet entities.
   * @param planetsImagesRepository A repository for interacting with planet image entities.
   * @param speciesRepository A repository for interacting with specie entities.
   * @param speciesImagesRepository A repository for interacting with specie image entities.
   * @param vehiclesRepository Repository for interacting with vehicle entities.
   * @param vehiclesImagesRepository A repository for interacting with entities and vehicle images.
   * @param starshipsRepository Repository for interacting with starship entities.
   * @param starshipsImagesRepository A repository for interacting with starship image entities.
   */
  constructor(
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>,
    @InjectRepository(Films)
    private readonly filmsRepository: Repository<Films>,
    @InjectRepository(PeopleImages)
    private readonly peopleImagesRepository: Repository<PeopleImages>,
    @InjectRepository(FilmsImages)
    private readonly filmsImagesRepository: Repository<FilmsImages>,
    @InjectRepository(Planets)
    private readonly planetsRepository: Repository<Planets>,
    @InjectRepository(PlanetsImages)
    private readonly planetsImagesRepository: Repository<PlanetsImages>,
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
    @InjectRepository(SpeciesImages)
    private readonly speciesImagesRepository: Repository<SpeciesImages>,
    @InjectRepository(Vehicles)
    private readonly vehiclesRepository: Repository<Vehicles>,
    @InjectRepository(VehiclesImages)
    private readonly vehiclesImagesRepository: Repository<VehiclesImages>,
    @InjectRepository(Starships)
    private readonly starshipsRepository: Repository<Starships>,
    @InjectRepository(StarshipsImages)
    private readonly starshipsImagesRepository: Repository<StarshipsImages>,
  ) {}

  /**
   * Map of names of entity constructors and repositories for entities.
   */
  private readonly EntitiesRepositoriesMap: {
    [key: string]: Repository<OneOfItems> | Repository<OneOfItemImages>;
  } = {
    People: this.peopleRepository,
    PeopleService: this.peopleImagesRepository,
    Films: this.filmsRepository,
    FilmsImages: this.filmsImagesRepository,
    Planets: this.planetsRepository,
    PlanetsImages: this.planetsImagesRepository,
    Species: this.speciesRepository,
    SpeciesImages: this.speciesImagesRepository,
    Vehicles: this.vehiclesRepository,
    VehiclesImages: this.vehiclesImagesRepository,
    Starships: this.starshipsRepository,
    StarshipsImages: this.starshipsImagesRepository,
  };

  /**
   * Retrieves entities of a certain structure by their references.
   *
   * @param instanceEntity An entity instance.
   * @param urls Entities urls.
   * @returns Entities.
   */
  async getEntitiesByUrls(instanceEntity: OneOfAllTypes, urls: string[]) {
    try {
      const constructorName = instanceEntity.constructor.name;
      const repository = this.EntitiesRepositoriesMap[constructorName];
      const entities = [];
      if (urls && urls.length > 0) {
        for (const url of urls) {
          if (url) {
            entities.push(...(await repository.findBy({ url: url })));
          }
        }
      }
      return entities;
    } catch (error) {
      console.error('Error getting entities by urls:', error);
    }
  }

  /**
   * Retrieves urls that do not exist in the database.
   *
   * @param data Data for creating/updating the item entity.
   * @returns Urls that do not exist in the database.
   */
  async getNonExistingItemUrls(
    data: OneOfCreateItemsDto | OneOfUpdateItemsDto,
  ): Promise<string[]> {
    try {
      const unexistUrls: string[] = [];
      for (const key in data) {
        if (key === 'homeworld' && typeof data[key] === 'string') {
          unexistUrls.push(
            ...(await this.getNonExistingUrls(new Planets(), [data[key]])),
          );
        }
        const elem = data[key];
        if (Array.isArray(elem)) {
          if (elem.length > 0)
            switch (key) {
              case 'characters' || 'residents': {
                unexistUrls.push(
                  ...(await this.getNonExistingUrls(new People(), elem)),
                );
                break;
              }
              case 'films':
                unexistUrls.push(
                  ...(await this.getNonExistingUrls(new Films(), elem)),
                );
                break;
              case 'planets' || 'homeworld': {
                unexistUrls.push(
                  ...(await this.getNonExistingUrls(new Planets(), elem)),
                );
                break;
              }
              case 'species':
                unexistUrls.push(
                  ...(await this.getNonExistingUrls(new Species(), elem)),
                );
                break;
              case 'vehicles':
                unexistUrls.push(
                  ...(await this.getNonExistingUrls(new Vehicles(), elem)),
                );
                break;
              case 'starships':
                unexistUrls.push(
                  ...(await this.getNonExistingUrls(new Starships(), elem)),
                );
                break;
              default:
                break;
            }
        }
      }
      return unexistUrls;
    } catch (error) {
      console.error('Error getting non-existent urls:', error);
    }
  }

  /**
   * Gets urls that do not exist in the database for a specific element entity structure from
   * transmitted urls.
   *
   * @param instanceEntity An entity instance.
   * @param searchUrls Possible non-existent urls.
   * @returns Urls that do not exist in the database.
   */
  async getNonExistingUrls(
    instanceEntity: OneOfItems,
    searchUrls: string[],
  ): Promise<string[]> {
    try {
      const constructorName = instanceEntity.constructor.name;
      const repository = this.EntitiesRepositoriesMap[constructorName];

      const urls = (await repository.find()).map(
        (item: OneOfAllTypes) => item.url,
      );
      const unexistUrls = searchUrls.filter((url) => !urls.includes(url));

      return unexistUrls;
    } catch (error) {
      console.error('Error getting non-existent urls:', error);
    }
  }
}
