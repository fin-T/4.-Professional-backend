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
        let filmsService = app.get(FilmsService);
        let url: string = `https://swapi.dev/api/films/?page=1`;


        while (url) {
            let response = await fetch(url);
            let jsonData = await response.json();
            let films: Films[] = jsonData.results;

            for (let person of films) {
                await filmsService.downloadToDBByUrl(person.url);
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
        let url: string = `https://swapi.dev/api/people/?page=1`;


        while (url) {
            let response = await fetch(url);
            let jsonData = await response.json();
            let people: People[] = jsonData.results;

            for (let person of people) {
                await peopleService.downloadToDBByUrl(person.url);
            }

            url = jsonData.next;
        }
        console.log('Downloading people to DB from swapi.dev successful.')
    } catch (error) {
        console.error('Error downloading people to DB from swapi.dev:', error);
    }
}