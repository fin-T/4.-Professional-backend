import mysql from 'mysql2';
import fs from 'fs';
import { INestApplication } from '@nestjs/common';
import { PeopleService } from 'src/people/people.service';
import { FilmsService } from 'src/films/films.service';
import { People } from 'src/people/entities/people.entity';
import { Films } from 'src/films/entities/films.entity';

export async function createDB() {
    try {
        let pool = mysql.createPool({
            host: process.env.HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD
        }).promise();

        let createDB = fs.readFileSync('migrations/create_db.sql', 'utf8');
        await pool.query(createDB);
        console.log('Database has been successfully created.')
    } catch (error) {
        console.error('Error creating DB:', error);
    }
}

export async function downloadDataToDB(app: INestApplication<any>) {
    await downloadPeopleToDB(app);
    await downloadFilmsToDB(app);
    // await downloadPlanetsToDB(app);
    // await downloadSpeciesToDB(app);
    // await downloadStarshipsToDB(app);
    // await downloadVehiclesToDB(app);
    console.log(`\nThe data has been successfully loaded into the database. \nYou can begin.`)
}

async function downloadFilmsToDB(app: INestApplication<any>) {
    try {
        const filmService = app.get(FilmsService);
        let url: string = `https://swapi.dev/api/films/?page=1`;

        while (url) {
            const response = await fetch(url);
            const jsonData = await response.json();
            const films: Films[] = jsonData.results;

            for (let film of films) {
                if (!(await filmService.includes(film.title))) {
                    let newFilm = await filmService.create(film);
                    await filmService.save(newFilm);
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
        let personService = app.get(PeopleService);
        let url: string = `https://swapi.dev/api/people/?page=1`;

        while (url) {
            let response = await fetch(url);
            let jsonData = await response.json();
            let people: People[] = jsonData.results;

            for (let person of people) {
                if (!(await personService.includes(person.name))) {
                    let newPerson = await personService.create(person);
                    await personService.save(newPerson);
                }
            }

            url = jsonData.next;
        }
        console.log('Downloading people to DB from swapi.dev successful.')
    } catch (error) {
        console.error('Error downloading people to DB from swapi.dev:', error);
    }
}