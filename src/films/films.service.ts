import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Films } from './entities/films.entity';
import { FilmsImages } from './entities/filmsImages.entity';
import { ImagesDto } from 'src/common/dto/images.dto';
import { DBService } from 'src/db/dB.service';
import { CreateFilmsDto } from './dto/create_films.dto';
import { CreateFilmsFromSWapi } from './dto/create_films_from_SWapi.dto';
import { UpdateFilmsDto } from './dto/update_films.dto';
import { Service } from 'src/common/interfaces/service.interface';
import { FilmFullData } from './types/film_full_data.type';

@Injectable()
export class FilmsService implements Service<Films> {

    constructor(
        @InjectRepository(Films)
        private filmsRepository: Repository<Films>,
        @InjectRepository(FilmsImages)
        private imagesRepository: Repository<FilmsImages>,
        private readonly dBService: DBService,
    ) { }

    async includes(data: CreateFilmsDto): Promise<boolean> {
        if (data.url) {
            return !!(await this.filmsRepository.findOneBy({ url: data.url }));
        } else {
            return false;
        }
    }

    async downloadToDBByUrl(url: string): Promise<void> {
        try {
            let response = await fetch(url);
            let filmFromSWapi: Partial<CreateFilmsFromSWapi> = await response.json();
            let newFilm = new Films();
            newFilm.title = filmFromSWapi.title;
            newFilm.episode_id = filmFromSWapi.episode_id;
            newFilm.opening_crawl = filmFromSWapi.opening_crawl;
            newFilm.director = filmFromSWapi.director;
            newFilm.producer = filmFromSWapi.producer;
            newFilm.release_date = filmFromSWapi.release_date;
            newFilm.characters = await this.dBService.getPeopleFromDBByUrls(filmFromSWapi.characters);
            newFilm.created = new Date().toISOString();
            newFilm.edited = new Date().toISOString();
            newFilm.url = filmFromSWapi.url;

            await this.filmsRepository.save(newFilm);
        } catch (error) {
            console.error('Error downoading films to DB by url:', error);
        }
    }

    async create(data: CreateFilmsDto): Promise<Films> {
        try {
            let newFilm = new Films();
            newFilm.title = data.title;
            newFilm.episode_id = data.episode_id;
            newFilm.opening_crawl = data.opening_crawl;
            newFilm.director = data.director;
            newFilm.producer = data.producer;
            newFilm.release_date = data.release_date;
            newFilm.characters = await this.dBService.getPeopleFromDBByUrls(data.characters);
            newFilm.created = new Date().toISOString()
            newFilm.edited = new Date().toISOString();
            newFilm.images = await this.dBService.getFilmsImagesFromDBByUrls(data.images);
            if (data.url) {
                newFilm.url = data.url;
                await this.filmsRepository.save(newFilm);
            } else {
                let newFilmId = (await this.filmsRepository.save(newFilm)).id;
                let uniqueUrl = `https://default-domain.dev/api/films/${newFilmId}/`;
                newFilm.url = uniqueUrl;
                await this.filmsRepository.save(newFilm);
            }

            console.log('The film was crated successfully.');
            return newFilm;
        } catch (error) {
            console.error('Error creating film:', error);
        }
    }

    async getObjectsFromThePage(page: number): Promise<Films[]> {
        let objectsLimitOnThePage = 10;
        let filmsWithPeople = await this.filmsRepository.find({
            skip: (page - 1) * objectsLimitOnThePage, take: objectsLimitOnThePage,
            relations: ["characters"]
        });

        let filmsFullData: FilmFullData[] = filmsWithPeople;

        let filmsShortData = [];

        for (let film of filmsFullData) {
            film.characters = film.characters.map((person: { url: string } | string) => {
                if (typeof person !== 'string') return person.url;
            });
            filmsShortData.push(film);
        }
        return filmsShortData;
    }

    async getTotal(): Promise<number> {
        return await this.filmsRepository.count();
    }

    async getFilm(filmId: number): Promise<FilmFullData> {
        let filmWithPeople = await this.filmsRepository.findOne({
            where: { id: filmId },
            relations: ["characters"]
        });

        let filmShortData: FilmFullData = filmWithPeople;

        filmShortData.characters = filmShortData.characters.map((person: { url: string } | string) => {
            if (typeof person !== 'string') return person.url;
        });

        return filmShortData;
    }

    async update(filmId: number, updatedData?: UpdateFilmsDto): Promise<Films> {
        try {
            let filmToUpdate = await this.filmsRepository.findOneBy({ id: filmId });

            filmToUpdate.edited = new Date().toDateString();

            let updatedFilm = Object.assign(filmToUpdate, updatedData);

            await this.filmsRepository.save(updatedFilm);

            console.log('The film was updated successfully.');

            return await this.filmsRepository.findOneBy({ id: updatedFilm.id });
        } catch (error) {
            console.error('Film updating error:', error);
        }
    }

    async getAllIds(): Promise<number[]> {
        const films = await this.filmsRepository.find();
        return films.map(films => films.id);
    }

    async delete(id: number): Promise<void> {
        try {
            let personToDelete: Films = await this.filmsRepository.findOneBy({ id: id });

            await this.filmsRepository.remove(personToDelete);
            console.log('The film was deleted successfully.');
        } catch (error) {
            console.error('Film delete error:', error);
        }
    }

    async downloadImages(data: ImagesDto, filmId: number): Promise<FilmFullData> {
        try {
            let selectedFilm = await this.filmsRepository.findOneBy({ id: filmId });
            if (!selectedFilm) throw new Error('Film not found.');

            let filmImages = await this.imagesRepository.findBy({ films: selectedFilm });
            let filmImageUrls = filmImages.map(image => image.url);

            for (let image of data.urls) {
                if (!filmImageUrls.includes(image)) {
                    let newImage = new FilmsImages();
                    newImage.url = image;
                    filmImages.push(newImage);
                    selectedFilm.images = filmImages;
                    await this.filmsRepository.save(selectedFilm);
                }
            }

            console.log("Images downloaded successfully.");
            return await this.getFilm(filmId);
        } catch (error) {
            console.error('Error downloading images:', error);
        }
    }

    async deleteImage(filmId: number, imageId: number): Promise<FilmFullData> {
        try {
            let selectedFilm = await this.filmsRepository.findOneBy({ id: filmId });
            let imagesForDelete = await this.imagesRepository.findBy({ films: selectedFilm });
            let imageForDelete: FilmsImages;
            imagesForDelete.forEach(image => {
                if (image.id === imageId) {
                    imageForDelete = image;
                }
            })
            await this.imagesRepository.remove(imageForDelete);
            console.log("Images deleted successfully.");
            return await this.getFilm(filmId);
        } catch (error) {
            console.log('Error deleting image:', error)
        }
    }

    async getAllImageIds(): Promise<number[]> {
        let allImages = await this.imagesRepository.find();
        let allImagIds = allImages.map(image => image.id);
        return allImagIds;
    }

    async getAllImages(): Promise<FilmsImages[]> {
        return await this.imagesRepository.find();
    }

    async includesImage(images: ImagesDto, filmId: number): Promise<boolean> {
        let selectedFilm = await this.filmsRepository.findOneBy({ id: filmId });
        let allImages = await this.imagesRepository.findBy({ films: selectedFilm });
        let allImageUrls = allImages.map(image => image.url);
        for (let key in images.urls) {
            let url = images.urls[key];
           if (allImageUrls.includes(url)) {
               return true;
           }
       }
        return false;
    }

    async getAllImageUrls(): Promise<string[]> {
        let allImages = await this.getAllImages();
        let allImageUrls = allImages.map(image => image.url);
        return allImageUrls;
    }
}
