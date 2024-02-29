import { INestApplication, Injectable } from '@nestjs/common';
import { Service } from 'src/common/interfaces/service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Films } from './entities/films.entity';
import { FilmsImages } from './entities/filmsImages.entity';
import { ImagesDto } from 'src/common/dto/images.dto';
import { DBService } from 'src/db/dB.service';

@Injectable()
export class FilmsService implements Service<Films> {

    constructor(
        @InjectRepository(Films)
        private filmsRepository: Repository<Films>,
        @InjectRepository(FilmsImages)
        private imagesRepository: Repository<FilmsImages>,
        private readonly dBService: DBService,
    ) { }

    async includes(name: string): Promise<boolean> {
        return !!(await this.filmsRepository.findOne({ where: { title: name } }));
    }

    async create(data: Partial<Films> | string): Promise<Films> {
        try {
            if (typeof data === 'string') {
                let response = await fetch(data);
                let newFilm = await response.json();
                return newFilm;
            } else {
                const newFilm = new Films();
                newFilm.title = data.title;
                newFilm.episode_id = data.episode_id;
                newFilm.opening_crawl = data.opening_crawl;
                newFilm.director = data.director;
                newFilm.producer = data.producer;
                newFilm.release_date = data.release_date;
                newFilm.characters = await this.dBService.getPeople(data.characters);
                // newFilm.planets = await this.dBService.getPlanets(filmOrUrl.planets);
                // newFilm.starships = await this.dBService.getStarships(filmOrUrl.starships);
                // newFilm.vehicle = await this.dBService.getVehicles(filmOrUrl.vehicle);
                // newFilm.species = await this.dBService.getSpecies((filmOrUrl.species));
                newFilm.created = data.created;
                newFilm.edited = data.edited;
                newFilm.url = newFilm;
                return newFilm;
            }
        } catch (error) {
            console.error('Error creating person:', error);
        }
    }

    async save(data: Partial<Films>): Promise<void> {
        try {
            await this.filmsRepository.save(data);
            console.log('The film was saved successfully.');
        } catch (error) {
            console.error('Error saving film:', error);
        }
    }

    async getObjectsFromThePage(page: number): Promise<Films[]> {
        let objectsLimitOnThePage = 10;
        return await this.filmsRepository.find({ skip: (page - 1) * objectsLimitOnThePage, take: objectsLimitOnThePage });

    }

    async getTotal(): Promise<number> {
        return await this.filmsRepository.count();
    }

    async update(id: number, updatedData?: Partial<Films>): Promise<Films> {
        try {
            let personToUpdate = await this.filmsRepository.findOne({ where: { id: id } });

            let updatedPerson = await this.create(updatedData);

            updatedPerson = Object.assign(personToUpdate, updatedPerson);

            await this.filmsRepository.save(updatedPerson);

            console.log('The film was updated successfully.');
            return await this.filmsRepository.findOne({ where: { id: updatedPerson.id } });
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
            let personToDelete: Films = await this.filmsRepository.findOne({ where: { id: id } });

            await this.filmsRepository.remove(personToDelete);
            console.log('The film was deleted successfully.');
        } catch (error) {
            console.error('Film delete error:', error);
        }
    }

    async downloadImages(data: ImagesDto, filmId: number): Promise<void> {
        try {
            let selectedFilm = await this.filmsRepository.findOne({ where: { id: filmId } });
            if (!selectedFilm) throw new Error('Film not found.');

            let filmImages = await this.imagesRepository.find({ where: { films: selectedFilm } });
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
        } catch (error) {
            console.error('Error downloading images:', error);
        }
    }

    async deleteImage(filmId: number, imageId: number): Promise<void> {
        try {
            let selectedFilm = await this.filmsRepository.findOne({ where: { id: filmId } });
            let imagesForDelete = await this.imagesRepository.find({ where: { films: selectedFilm } });
            let imageForDelete: FilmsImages;
            imagesForDelete.forEach(image => {
                if (image.id === imageId) {
                    imageForDelete = image;
                }
            })
            await this.imagesRepository.remove(imageForDelete);
            console.log("Images deleted successfully.");
        } catch (error) {
            console.log('Error deleting image:', error)
        }
    }
}
