import { Test, TestingModule } from '@nestjs/testing';
import { PeopleController } from '../people.controller';
import { PeopleService } from '../people.service';
import { CommonService } from './../../common/common.service';
import { Films } from './../../films/entities/films.entity';
import { FilmsImages } from './../../films/entities/filmsImages.entity';
import { Planets } from './../../planets/entities/planets.entity';
import { PlanetsImages } from './../../planets/entities/planetsImages.entity';
import { Species } from './../../species/entities/species.entity';
import { SpeciesImages } from './../../species/entities/speciesImages.entity';
import { Starships } from './../../starships/entities/starships.entity';
import { StarshipsImages } from './../../starships/entities/starshipsImages.entity';
import { Users } from './../../users/entities/users.entity';
import { Vehicles } from './../../vehicles/entities/vehicles.entity';
import { VehiclesImages } from './../../vehicles/entities/vehiclesImages.entity';
import { People } from '../entities/people.entity';
import { PeopleImages } from '../entities/peopleImages.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MOCK_IMAGE,
  MOCK_IMAGES,
  MOCK_PERSON,
  MOCK_SHORT_PERSON_DATA,
} from './constants';
import { CreatePeopleDto } from '../dto/create_people.dto';
import { OneOfItems } from 'src/common/types/types';
import { JwtService } from '@nestjs/jwt';

describe('PeopleController', () => {
  let peopleController: PeopleController;
  let peopleService: PeopleService;
  let commonService: CommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeopleController],
      providers: [
        CommonService,
        PeopleService,
        JwtService,
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
          Users,
        ]),
      ],
    }).compile();

    peopleController = module.get<PeopleController>(PeopleController);
    peopleService = module.get<PeopleService>(PeopleService);
    commonService = module.get<CommonService>(CommonService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(peopleController).toBeDefined();
  });

  describe('createPerson', () => {
    it('should create a new person', async () => {
      const createPeopleDto: CreatePeopleDto = { ...MOCK_SHORT_PERSON_DATA };

      jest.spyOn(peopleService, 'isItemUrlExists').mockResolvedValue(null);
      jest.spyOn(commonService, 'getNonExistingItemUrls').mockResolvedValue([]);
      jest.spyOn(peopleService, 'create').mockResolvedValue(MOCK_PERSON);

      const result = await peopleController.createPerson(createPeopleDto);

      expect(result).toBeDefined();
      expect(result).toEqual(MOCK_SHORT_PERSON_DATA);
    });
  });

  describe('getPeople', () => {
    it('should return a 10 people', async () => {
      const page = 1;
      const tenPeople = [
        MOCK_PERSON,
        MOCK_PERSON,
        MOCK_PERSON,
        MOCK_PERSON,
        MOCK_PERSON,
        MOCK_PERSON,
        MOCK_PERSON,
        MOCK_PERSON,
        MOCK_PERSON,
        MOCK_PERSON,
      ];
      const expectedResult = [
        MOCK_SHORT_PERSON_DATA,
        MOCK_SHORT_PERSON_DATA,
        MOCK_SHORT_PERSON_DATA,
        MOCK_SHORT_PERSON_DATA,
        MOCK_SHORT_PERSON_DATA,
        MOCK_SHORT_PERSON_DATA,
        MOCK_SHORT_PERSON_DATA,
        MOCK_SHORT_PERSON_DATA,
        MOCK_SHORT_PERSON_DATA,
        MOCK_SHORT_PERSON_DATA,
      ];

      jest
        .spyOn(peopleService, 'getItemsFromThePage')
        .mockResolvedValue(tenPeople);
      jest
        .spyOn(peopleService, 'setItemDataForResponse')
        .mockReturnValueOnce(MOCK_SHORT_PERSON_DATA as never);

      const result = (await peopleController.getPeople(page)) as People[];
      expect(result).toBeDefined();
      expect(result.length).toEqual(expectedResult.length);
      for (let i = 0; i < result.length; i++) {
        expect(result[i]).toEqual(expectedResult[i]);
      }
    });
  });

  describe('updatePerson', () => {
    it('should return updated person', async () => {
      const updatedData = {
        name: 'Roma',
        height: '202',
        mass: '35',
        hair_color: 'green',
        skin_color: 'black',
        eye_color: 'blue',
        birth_year: '18.11.2020',
        gender: 'famale',
        homeworld: null,
        films: [],
        species: [],
        vehicles: [],
        starships: [],
        url: 'https://anotherWorld.com/api/people/1/',
      };

      const personToUpdate = MOCK_PERSON;

      Object.assign(personToUpdate, updatedData);

      jest.spyOn(peopleService, 'getItem').mockResolvedValue(personToUpdate);
      jest.spyOn(peopleService, 'isItemUrlExists').mockResolvedValue(null);
      jest.spyOn(commonService, 'getNonExistingItemUrls').mockResolvedValue([]);
      jest.spyOn(peopleService, 'update').mockResolvedValue(personToUpdate);

      const result = (await peopleController.updatePerson(
        1,
        updatedData,
      )) as People;

      expect(result).toBeDefined();
      expect(result.name).toEqual(personToUpdate.name);
      expect(result.url).toEqual(personToUpdate.url);
    });
  });

  describe('deletePerson', () => {
    it('should return deleted person', async () => {
      jest.spyOn(peopleService, 'getItem').mockResolvedValue(MOCK_PERSON);
      jest.spyOn(peopleService, 'deleteItem').mockResolvedValue(MOCK_PERSON);

      const result = (await peopleController.deletePerson(1)) as People;

      expect(result).toBeDefined();
      expect(result.name).toEqual(MOCK_PERSON.name);
      expect(result.url).toEqual(MOCK_PERSON.url);
    });
  });

  describe('downloadImages', () => {
    it('should return person with downloaded images', async () => {
      jest.spyOn(peopleService, 'getItem').mockResolvedValue(MOCK_PERSON);
      jest
        .spyOn(peopleService, 'downloadItemImages')
        .mockResolvedValue(MOCK_PERSON);
      jest
        .spyOn(peopleService, 'setItemDataForResponse')
        .mockImplementation((item: OneOfItems) => item);

      const result = await peopleController.downloadImages(
        MOCK_IMAGES,
        MOCK_PERSON.id,
      );

      const expectedResponse = peopleService.setItemDataForResponse(
        MOCK_PERSON,
      ) as OneOfItems;

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('deleteImages', () => {
    it('should return person without deleted images', async () => {
      const personWithoutImage = { ...MOCK_PERSON };
      personWithoutImage.images = [];
      jest.spyOn(peopleService, 'getItem').mockResolvedValue(MOCK_PERSON);
      jest.spyOn(peopleService, 'getImage').mockResolvedValue(MOCK_IMAGE);
      jest.spyOn(peopleService, 'deleteImage').mockResolvedValue(MOCK_IMAGE);

      const result = (await peopleController.deleteImages(
        MOCK_PERSON.id,
        MOCK_IMAGE.id,
      )) as People;

      expect(result).toBeDefined();
      expect(result.name).toEqual(MOCK_PERSON.name);
      expect(result.images).toEqual(MOCK_SHORT_PERSON_DATA.images);
    });
  });

  describe('getPerson', () => {
    it('should return person', async () => {
      jest.spyOn(peopleService, 'getItem').mockResolvedValue(MOCK_PERSON);

      const result = (await peopleController.getPerson(
        MOCK_PERSON.id,
      )) as People;

      expect(result).toBeDefined();
      expect(result.name).toEqual(MOCK_SHORT_PERSON_DATA.name);
    });
  });

  function getRepositoryProviders(entities: any[]): any[] {
    return entities.map((entity) => ({
      provide: getRepositoryToken(entity),
      useClass: Repository,
    }));
  }
});
