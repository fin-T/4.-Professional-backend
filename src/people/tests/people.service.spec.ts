import { Test, TestingModule } from "@nestjs/testing";
import { PeopleService } from "../people.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EntityMetadata, Repository } from "typeorm";
import { People } from "../entities/people.entity";
import { PeopleImages } from "../entities/peopleImages.entity";
import { SpeciesImages } from "./../../species/entities/speciesImages.entity";
import { Films } from "./../../films/entities/films.entity";
import { FilmsImages } from "./../../films/entities/filmsImages.entity";
import { Planets } from "./../../planets/entities/planets.entity";
import { PlanetsImages } from "./../../planets/entities/planetsImages.entity";
import { Species } from "./../../species/entities/species.entity";
import { Starships } from "./../../starships/entities/starships.entity";
import { StarshipsImages } from "./../../starships/entities/starshipsImages.entity";
import { Users } from "./../../users/entities/users.entity";
import { Vehicles } from "./../../vehicles/entities/vehicles.entity";
import { VehiclesImages } from "./../../vehicles/entities/vehiclesImages.entity";
import { CommonService } from "./../../common/common.service";
import { ROOT_URL } from "./../../common/constants/constants";
import { CreatePeopleDto } from "../dto/create_people.dto";
import { UpdatePeopleDto } from "../dto/update_people.dto";
import { MOCK_METADATA, MOCK_FILM, MOCK_IMAGE, MOCK_IMAGES, MOCK_PERSON } from "./constants";

describe('PeopleService', () => {
    let peopleService: PeopleService;
    let peopleRepository: Partial<Repository<People>>;
    let imagesRepositiry: Repository<PeopleImages>;
    let planetsRepositiry: Repository<Planets>;
    let filmsRepositiry: Repository<Films>;
    let vehiclesRepositiry: Repository<Vehicles>;
    let speciesRepositiry: Repository<Species>;
    let starshipsRepositiry: Repository<Starships>;

    const PEOPLE_REPOSITORY_TOKEN = getRepositoryToken(People);
    const IMAGES_REPOSITORY_TOKEN = getRepositoryToken(PeopleImages);
    const PLANETS_REPOSITORY_TOKEN = getRepositoryToken(Planets);
    const FILMS_REPOSITORY_TOKEN = getRepositoryToken(Films);
    const VEHICLES_REPOSITORY_TOKEN = getRepositoryToken(Vehicles);
    const SPECIES_REPOSITORY_TOKEN = getRepositoryToken(Species);
    const STARSHIPS_REPOSITORY_TOKEN = getRepositoryToken(Starships);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PeopleService,
                CommonService,
                ...getRepositoryProviders([
                    People,
                    PeopleImages,
                    Films,
                    FilmsImages,
                    Species,
                    SpeciesImages,
                    Planets,
                    PlanetsImages,
                    Vehicles,
                    VehiclesImages,
                    Starships,
                    StarshipsImages,
                    Users
                ])
            ]
        }).compile();

        peopleService = module.get<PeopleService>(PeopleService);
        peopleRepository = module.get<Repository<People>>(PEOPLE_REPOSITORY_TOKEN);
        imagesRepositiry = module.get<Repository<PeopleImages>>(IMAGES_REPOSITORY_TOKEN);
        planetsRepositiry = module.get<Repository<Planets>>(PLANETS_REPOSITORY_TOKEN);
        filmsRepositiry = module.get<Repository<Films>>(FILMS_REPOSITORY_TOKEN);
        vehiclesRepositiry = module.get<Repository<Vehicles>>(VEHICLES_REPOSITORY_TOKEN);
        speciesRepositiry = module.get<Repository<Species>>(SPECIES_REPOSITORY_TOKEN);
        vehiclesRepositiry = module.get<Repository<Vehicles>>(VEHICLES_REPOSITORY_TOKEN);
        starshipsRepositiry = module.get<Repository<Starships>>(STARSHIPS_REPOSITORY_TOKEN);
    })

    it('service should be defined', () => {
        expect(peopleService).toBeDefined();
    })

    it('peopleReopository should be defined', () => {
        expect(peopleRepository).toBeDefined();
    })

    describe('isItemUrlExist', () => {
        it('should return person if url exists', async () => {
            jest.spyOn(peopleRepository, 'findOne').mockResolvedValue(MOCK_PERSON);

            let result = await peopleService.isItemUrlExists(MOCK_PERSON.url) as People;

            expect(result).toBeDefined();
            expect(result.name).toBe(MOCK_PERSON.name);
        });

        it('should return null if url non exists', async () => {
            jest.spyOn(peopleRepository, 'findOne').mockResolvedValue(null);

            let result = await peopleService.isItemUrlExists(MOCK_PERSON.url + 'nonExistingPart');

            expect(result).toBe(null);
        });
    });

    describe('createItemUniqueUrl', () => {
        it('should return unique url for person', async () => {
            let mockMaxId = MOCK_PERSON.id;

            jest.spyOn(peopleRepository, 'createQueryBuilder').mockReturnValueOnce({
                select: jest.fn().mockReturnThis(),
                getRawOne: jest.fn().mockResolvedValueOnce({ 'maxId': mockMaxId }),
            } as any);
            jest.spyOn(peopleRepository, 'findOne').mockResolvedValueOnce(null);

            let expectedUrl = `${ROOT_URL}/people/${mockMaxId + 1}/`;

            let result = await peopleService.createItemUniqueUrl(new People);

            expect(result).toBeDefined();
            expect(result).toBe(expectedUrl);
        })
    });

    describe('setItemDataForResponse', () => {
        it('should return person with short data of relized items', () => {
            let expextedShortFilmsData = [MOCK_FILM.url];

            let result = peopleService.setItemDataForResponse(MOCK_PERSON) as People;

            expect(result).toBeDefined();
            expect(result.films).toEqual(expextedShortFilmsData);
        })
    })

    describe('deleteItem', () => {
        it('should return deleted person', async () => {
            jest.spyOn(peopleRepository, 'findOneBy').mockResolvedValueOnce(MOCK_PERSON);
            jest.spyOn(peopleRepository, 'remove').mockResolvedValueOnce(MOCK_PERSON);

            let result = await peopleService.deleteItem(MOCK_PERSON.id) as People;

            expect(result).toBeDefined();
            expect(result.name).toBe(MOCK_PERSON.name);
        })

        it('should return null', async () => {
            jest.spyOn(peopleRepository, 'findOneBy').mockResolvedValueOnce(null);
            jest.spyOn(peopleRepository, 'remove').mockResolvedValueOnce(null);

            let nonExistingId = 2;

            let result = await peopleService.deleteItem(nonExistingId);

            expect(result).toBeDefined();
            expect(result).toBe(null);
        })
    })

    describe('downloadItemImages', () => {
        it('should return person with downloaded image urls', async () => {
            let mockImage: PeopleImages = {
                id: 1,
                url: "https://upload.wikimedia.org/phone.png",
                people: MOCK_PERSON
            };

            let mockPersonInstance = new People();
            Object.assign(mockPersonInstance, MOCK_PERSON)

            jest.spyOn(imagesRepositiry, 'save').mockResolvedValueOnce(mockImage);

            let result = await peopleService.downloadItemImages(MOCK_IMAGES, mockPersonInstance);

            expect(result).toBeDefined();
        })
    })

    describe('deleteImage', () => {
        it('should return deleted image', async () => {
            jest.spyOn(imagesRepositiry, 'findOneBy').mockResolvedValueOnce(MOCK_IMAGE);
            jest.spyOn(imagesRepositiry, 'remove').mockResolvedValueOnce(MOCK_IMAGE);

            let result = await peopleService.deleteImage(MOCK_IMAGE.id);

            expect(result).toBeDefined();
            expect(result.url).toEqual(MOCK_IMAGE.url);
        })

        it('should return null', async () => {
            let nonExistingImageId = 2;

            jest.spyOn(imagesRepositiry, 'findOneBy').mockResolvedValueOnce(null);
            jest.spyOn(imagesRepositiry, 'remove').mockResolvedValueOnce(null);

            let result = await peopleService.deleteImage(nonExistingImageId);

            expect(result).toBeDefined();
            expect(result).toBe(null);
        })
    })

    describe('getItem', () => {

        const metadataMock = {
            relations: [
                { propertyName: 'films' },
                { propertyName: 'homeworld' },
                { propertyName: 'species' },
                { propertyName: 'starships' },
                { propertyName: 'vehicles' },
            ]
        } as jest.Mocked<EntityMetadata>;


        it('should return person', async () => {
            jest.spyOn(peopleRepository, 'metadata', 'get').mockReturnValue(MOCK_METADATA);
            jest.spyOn(peopleRepository, 'findOne').mockResolvedValueOnce(MOCK_PERSON);

            let result = await peopleService.getItem(MOCK_PERSON.id) as People;

            expect(result).toBeDefined();
            expect(result).toBe(MOCK_PERSON);
            expect(result.name).toEqual(MOCK_PERSON.name);
        })

        it('should return null', async () => {
            let nonExistingId = 1;

            jest.spyOn(peopleRepository, 'metadata', 'get').mockReturnValue(metadataMock);
            jest.spyOn(peopleRepository, 'findOne').mockResolvedValueOnce(null);

            let result = await peopleService.getItem(nonExistingId);

            expect(result).toBeDefined();
            expect(result).toBe(null);
        })
    })

    describe('getImage', () => {
        it('should return image', async () => {
            jest.spyOn(imagesRepositiry, 'findOneBy').mockResolvedValueOnce(MOCK_IMAGE);

            let result = await peopleService.getImage(MOCK_IMAGE.id);

            expect(result).toBeDefined();
            expect(result.url).toEqual(MOCK_IMAGE.url);
        });

        it('shuold return null', async () => {
            let nonExistingId = 3;
            jest.spyOn(imagesRepositiry, 'findOneBy').mockResolvedValueOnce(null);

            let result = await peopleService.getImage(nonExistingId);

            expect(result).toBeDefined();
            expect(result).toEqual(null);
        })
    })

    describe('getItemsFromThePage', () => {
        it('should return items', async () => {
            let page = 1;

            let person = new People();
            person.name = 'Roma';
            let twentyPeople = [
                MOCK_PERSON, MOCK_PERSON, MOCK_PERSON, MOCK_PERSON, MOCK_PERSON, 
                MOCK_PERSON, MOCK_PERSON, MOCK_PERSON, MOCK_PERSON, MOCK_PERSON, 
                MOCK_PERSON, MOCK_PERSON, MOCK_PERSON, MOCK_PERSON, MOCK_PERSON, 
                MOCK_PERSON, MOCK_PERSON, MOCK_PERSON, MOCK_PERSON, MOCK_PERSON, 
            ];

            jest.spyOn(peopleRepository, 'metadata', 'get').mockReturnValue(MOCK_METADATA);
            jest.spyOn(peopleRepository, 'find').mockResolvedValueOnce(twentyPeople.slice(page - 1, 10));

            let result = await peopleService.getItemsFromThePage(page);

            expect(result).toBeDefined();
            expect(result).toEqual(twentyPeople.slice(page - 1, 10));
        })
    })

    describe('create', () => {
        it('should return created person', async () => {
            // The same as the already created person.
            let personToCreate: CreatePeopleDto = {
                name: "Roma",
                height: "182",
                mass: "72",
                hair_color: "black",
                skin_color: "white",
                eye_color: "green-brown",
                birth_year: "18.12.2023",
                gender: "male",
                homeworld: null,
                films: [],
                species: [],
                vehicles: [],
                starships: [],
                url: "https://swapi.py4e.com/api/people/1/",
            };

            let maxId = 10;
            jest.spyOn(peopleRepository, 'createQueryBuilder').mockReturnValueOnce({
                select: jest.fn().mockReturnThis(),
                getRawOne: jest.fn().mockResolvedValueOnce({ maxId }),
            } as any);
            jest.spyOn(filmsRepositiry, 'findBy').mockResolvedValueOnce([]);
            jest.spyOn(speciesRepositiry, 'findBy').mockResolvedValueOnce([]);
            jest.spyOn(vehiclesRepositiry, 'findBy').mockResolvedValueOnce([]);
            jest.spyOn(starshipsRepositiry, 'findBy').mockResolvedValueOnce([]);
            jest.spyOn(peopleRepository, 'save').mockResolvedValueOnce(MOCK_PERSON);

            let result = await peopleService.create(personToCreate);

            expect(result).toBeDefined();
            expect(result.name).toEqual(personToCreate.name);
            expect(result.url).toEqual(personToCreate.url);
        })
    })

    describe('update', () => {
        it('should return updated person', async () => {
            let updatedData: UpdatePeopleDto = {
                name: "Roma",
                height: "202",
                mass: "35",
                hair_color: "green",
                skin_color: "black",
                eye_color: "blue",
                birth_year: "18.11.2020",
                gender: "famale",
                homeworld: null,
                films: [],
                species: [],
                vehicles: [],
                starships: [],
                url: "https://anotherWorld.com/api/people/1/",
            };

            let personToUpdate = MOCK_PERSON;

            Object.assign(personToUpdate, updatedData);

            let maxId = 10;
            jest.spyOn(peopleRepository, 'createQueryBuilder').mockReturnValueOnce({
                select: jest.fn().mockReturnThis(),
                getRawOne: jest.fn().mockResolvedValueOnce({ maxId }),
            } as any);
            jest.spyOn(peopleService, 'createItemUniqueUrl').mockResolvedValue('https://swapi.py4e.com/api/people/11/');
            jest.spyOn(peopleRepository, 'findOneBy').mockResolvedValueOnce(MOCK_PERSON);
            jest.spyOn(filmsRepositiry, 'findBy').mockResolvedValueOnce([]);
            jest.spyOn(speciesRepositiry, 'findBy').mockResolvedValueOnce([]);
            jest.spyOn(vehiclesRepositiry, 'findBy').mockResolvedValueOnce([]);
            jest.spyOn(starshipsRepositiry, 'findBy').mockResolvedValueOnce([]);
            jest.spyOn(peopleRepository, 'save').mockResolvedValueOnce(personToUpdate);

            let result = await peopleService.update(1, updatedData);

            expect(result).toBeDefined();
            expect(result.name).toEqual(personToUpdate.name);
            expect(result.url).toEqual(personToUpdate.url);
        })
    });

    it('getPeople', () => {
        
    })

    function getRepositoryProviders(entities: any[]): any[] {
        return entities.map(entity => ({
            provide: getRepositoryToken(entity),
            useClass: Repository,
        }));
    }
});