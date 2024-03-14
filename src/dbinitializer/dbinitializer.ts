import { createPool } from 'mysql2';
import { readFileSync } from 'fs';
import { INestApplication } from '@nestjs/common';
import { PeopleService } from 'src/people/people.service';
import { FilmsService } from 'src/films/films.service';
import { PlanetsService } from 'src/planets/planets.service';
import { SpeciesService } from 'src/species/species.service';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { StarshipsService } from 'src/starships/starships.service';
import { AllCreateItemsDto, OneOfSevices } from 'src/common/types/types';
import {
    CREATE_DB, FILMS_URL, PEOPLE_URL, PLANETS_URL, SPECIES_URL, STARSHIPS_URL, VEHICLES_URL
} from 'src/common/constants/constants';
import { Pool } from 'mysql2/promise';
import { UsersService } from 'src/users/users.service';

console.log('DBInitilier');

/**
 * Creates data base.
 */
export async function createDB() {
    try {
        let pool: Pool = createPool({
            host: process.env.HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD
        }).promise();

        let createDB = readFileSync(CREATE_DB, 'utf8');
        await pool.query(createDB);

        console.log('Database has been successfully created.')
    } catch (error) {
        console.error('Error creating DB:', error);
    }
}

/**
 * Loads data into database from https://swapi.py4e.com/
 * 
 * @param app Nest app.
 */
export async function downloadDataToDB(app: INestApplication<any>) {
    try {
        let servicesUrlsMap = new Map<OneOfSevices, string>([
            [app.get(PeopleService), PEOPLE_URL],
            [app.get(FilmsService), FILMS_URL],
            [app.get(PlanetsService), PLANETS_URL],
            [app.get(SpeciesService), SPECIES_URL],
            [app.get(VehiclesService), VEHICLES_URL],
            [app.get(StarshipsService), STARSHIPS_URL]
        ])

        for (let serviceUrl of servicesUrlsMap) {
            let service = serviceUrl[0];
            let url = serviceUrl[1];

            while (url) {
                let response = await fetch(url);
                let jsonData = await response.json();
                let items: AllCreateItemsDto[] = jsonData.results;

                for (let item of items) {
                    if (!await service.isItemUrlExists(item.url)) {
                        await service.create(item);
                    }
                }

                url = jsonData.next;
            }
        }

        console.log(`\nThe data has been successfully downloaded into the database. \nYou can begin.`)
    } catch (error) {
        console.error('Error downloading species to DB from https://swapi.py4e.com/api/:', error);
    }
}