import { INestApplication } from '@nestjs/common';
import { PeopleService } from 'src/people/people.service';
import { FilmsService } from 'src/films/films.service';
import { PlanetsService } from 'src/planets/planets.service';
import { SpeciesService } from 'src/species/species.service';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { StarshipsService } from 'src/starships/starships.service';
import { AllCreateItemsDto, OneOfSevices } from 'src/common/types/types';
import {
  FILMS_URL,
  PEOPLE_URL,
  PLANETS_URL,
  SPECIES_URL,
  STARSHIPS_URL,
  VEHICLES_URL,
} from 'src/common/constants/constants';

console.log('DBInitilier');

/**
 * Loads data into database from https://swapi.py4e.com/
 *
 * @param app Nest app.
 */
export async function downloadDataToDB(app: INestApplication<any>) {
  try {
    const servicesUrlsMap = new Map<OneOfSevices, string>([
      [app.get(PeopleService), PEOPLE_URL],
      [app.get(FilmsService), FILMS_URL],
      [app.get(PlanetsService), PLANETS_URL],
      [app.get(SpeciesService), SPECIES_URL],
      [app.get(VehiclesService), VEHICLES_URL],
      [app.get(StarshipsService), STARSHIPS_URL],
    ]);

    for (const serviceUrl of servicesUrlsMap) {
      const service = serviceUrl[0];
      let url = serviceUrl[1];

      while (url) {
        const response = await fetch(url);
        const jsonData = await response.json();
        const items: AllCreateItemsDto[] = jsonData.results;

        for (const item of items) {
          if (!(await service.isItemUrlExists(item.url))) {
            await service.create(item);
          }
        }

        url = jsonData.next;
      }
    }

    console.log(
      `\nThe data has been successfully downloaded into the database. \nYou can begin.`,
    );
  } catch (error) {
    console.error(
      'Error downloading species to DB from https://swapi.py4e.com/api/:',
      error,
    );
  }
}
