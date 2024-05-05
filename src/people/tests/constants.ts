import { EntityMetadata } from 'typeorm';
import { People } from '../entities/people.entity';
import { PeopleImages } from '../entities/peopleImages.entity';
import { Films } from './../../films/entities/films.entity';
import { Readable } from 'typeorm/platform/PlatformTools';

/**
 * Mock person image for tests.
 */
export const MOCK_IMAGE: PeopleImages = {
  id: 1,
  url: 'https://star-wars-world-bucket.s3.us-east-1.amazonaws.com/people_1.png',
  people: new People(),
};

/**
 * Mock film for tests.
 */
export const MOCK_FILM: Films = {
  id: 1,
  title: 'New World',
  episode_id: 1,
  opening_crawl: 'some crawl...',
  director: 'Piter Joseph',
  producer: 'Json Gabriel',
  release_date: '12.12.2021',
  characters: [],
  planets: [],
  starships: [],
  vehicles: [],
  species: [],
  created: '',
  edited: '',
  url: 'https://swapi.py4e.com/api/films/1/',
  images: [],
};

/**
 * Mock person for tests.
 */
export const MOCK_PERSON: People = {
  id: 1,
  name: 'Roma',
  height: '182',
  mass: '722',
  hair_color: 'black',
  skin_color: 'white',
  eye_color: 'green-brown',
  birth_year: '18.12.2023',
  gender: 'male',
  homeworld: null,
  films: [MOCK_FILM],
  species: [],
  vehicles: [],
  starships: [],
  created: '2014-12-09T13:50:51.644000Z',
  edited: '2014-12-09T13:50:51.644000Z',
  url: 'https://swapi.py4e.com/api/people/1/',
  images: [MOCK_IMAGE],
};

/**
 * Mock person for tests, where data about items are there urls.
 */
export const MOCK_SHORT_PERSON_DATA = {
  id: 1,
  name: 'Roma',
  height: '182',
  mass: '722',
  hair_color: 'black',
  skin_color: 'white',
  eye_color: 'green-brown',
  birth_year: '18.12.2023',
  gender: 'male',
  homeworld: null,
  films: ['https://swapi.py4e.com/api/films/1/'],
  species: [],
  vehicles: [],
  starships: [],
  created: '2014-12-09T13:50:51.644000Z',
  edited: '2014-12-09T13:50:51.644000Z',
  url: 'https://swapi.py4e.com/api/people/1/',
  images: ['https://star-wars-world-bucket.s3.us-east-1.amazonaws.com/people_1.png'],
};

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
  ],
} as jest.Mocked<EntityMetadata>;

/**
 * Images mock (Images relation mock).
 */
export const MOCK_IMAGES: Express.Multer.File[] = [
  {
    fieldname: 'image',
    originalname: 'image1.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: Buffer.from('Mock image 1 data'),
    stream: new Readable(),
    destination: '',
    filename: '',
    path: '',
  },
  {
    fieldname: 'image',
    originalname: 'image2.png',
    encoding: '7bit',
    mimetype: 'image/png',
    size: 2048,
    buffer: Buffer.from('Mock image 2 data'),
    stream: new Readable(),
    destination: '',
    filename: '',
    path: '',
  },
];
