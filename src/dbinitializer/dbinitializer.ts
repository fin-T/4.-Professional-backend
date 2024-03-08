import mysql from 'mysql2';
import fs from 'fs';
import { INestApplication } from '@nestjs/common';
import { PeopleService } from 'src/people/people.service';
import { FilmsService } from 'src/films/films.service';
import { CreateFilmsDto } from 'src/films/dto/create_films.dto';
import { CreatePeopleDto } from 'src/people/dto/create_people.dto';
import { PlanetsService } from 'src/planets/planets.service';
import { CreatePlanetsDto } from 'src/planets/dto/create_planets.dto';
import { CREATE_DB, FILMS_URL, PEOPLE_URL, PLANETS_URL, SPECIES_URL } from 'src/common/constants';
import { SpeciesService } from 'src/species/species.service';
console.log('DBInitilier');

export async function createDB() {
    try {
        let pool = mysql.createPool({
            host: process.env.HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD
        }).promise();

        let createDB = fs.readFileSync(CREATE_DB, 'utf8');
        await pool.query(createDB);
        console.log('Database has been successfully created.')
    } catch (error) {
        console.error('Error creating DB:', error);
    }
}

export async function downloadDataToDB(app: INestApplication<any>) {
    await downloadPeopleToDB(app);
    await downloadFilmsToDB(app);
    await downloadPlanetsToDB(app);
    await downloadSpeciesToDB(app);
    // await downloadStarshipsToDB(app);
    // await downloadVehiclesToDB(app);
    console.log(`\nThe data has been successfully loaded into the database. \nYou can begin.`)
}

async function downloadSpeciesToDB(app: INestApplication<any>) {
    try {
        let speciesService = app.get(SpeciesService);
        let url: string = SPECIES_URL;

        while (url) {
            let response = await fetch(url);
            let jsonData = await response.json();
            let species: CreatePlanetsDto[] = jsonData.results;

            for(let specie of species) {
                if (specie.url && !(await speciesService.includes(specie))) {
                    await speciesService.downloadToDBByUrl(specie.url);
                }
            }

            url = jsonData.next;
        }
        console.log('Downloading species to DB from swapi.dev successful.')
    } catch (error) {
        console.error('Error downloading species to DB from swapi.dev:', error);
    }
}

async function downloadPlanetsToDB(app: INestApplication<any>) {
    try {
        let planetsService = app.get(PlanetsService);
        let url: string = PLANETS_URL;

        while (url) {
            let response = await fetch(url);
            let jsonData = await response.json();
            let planets: CreatePlanetsDto[] = jsonData.results;
            for( let planet of planets) {
                if (planet.url && !(await planetsService.includes(planet))) {
                    await planetsService.downloadToDBByUrl(planet.url);
                }
            }

            url = jsonData.next;
        }
        console.log('Downloading planets to DB from swapi.dev successful.')
    } catch (error) {
        console.error('Error downloading planets to DB from swapi.dev:', error);
    }
}

async function downloadFilmsToDB(app: INestApplication<any>) {
    try {
        let filmsService = app.get(FilmsService);
        let url: string = FILMS_URL;

        while (url) {
            let response = await fetch(url);
            let jsonData = await response.json();
            let films: CreateFilmsDto[] = jsonData.results;

            for(let film of films) {
                if (film.url && !(await filmsService.includes(film))) {
                    await filmsService.downloadToDBByUrl(film.url);
                }
            }

            url = jsonData.next;
        }
        console.log('Downloading films to DB from swapi.dev successful.')
    } catch (error) {
        console.error('Error downloading films to DB from swapi.dev:', error);
    }
}

async function downloadPeopleToDB(app: INestApplication<any>) {
    try {
        let peopleService = app.get(PeopleService);
        let url: string = PEOPLE_URL;

        while (url) {
            let response = await fetch(url);
            let jsonData = await response.json();
            let people: CreatePeopleDto[] = jsonData.results;

            for(let person of people) {
                await peopleService.create(person);
            }

            url = jsonData.next;
        }
        console.log('Downloading people to DB from swapi.dev successful.')
    } catch (error) {
        console.error('Error downloading people to DB from swapi.dev:', error);
    }
}