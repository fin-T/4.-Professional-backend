import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { People } from './entities/people.entity';
import { PeopleImages } from './entities/peopleImages.entity';
import { ImagesDto } from 'src/common/dto/images.dto';
import { DBService } from 'src/db/dB.service';
import { CreatePeopleDto } from './dto/create_people.dto';
import { UpdatePeopleDto } from './dto/update_people.dto';
import { CreatePeopleFromSWapi } from './dto/create_people_from_SWapi.dto';
import { Service } from 'src/common/interfaces/service.interface';
import { PersonShortData as PersonFullData } from './types/person_full_data.type';

@Injectable()
export class PeopleService implements Service<People>  {

    constructor(
        @InjectRepository(People)
        private peopleRepository: Repository<People>,
        @InjectRepository(PeopleImages)
        private imagesRepository: Repository<PeopleImages>,
        private readonly dBService: DBService,
    ) { }

    async includes(data: CreatePeopleDto): Promise<boolean> {
        if (data.url) {
            return !!(await this.peopleRepository.findOneBy({ url: data.url }));
        } else {
            return false;
        }
    }

    async downloadToDBByUrl(url: string): Promise<void> {
        try {
            let response = await fetch(url);
            let personFromSWapi: Partial<CreatePeopleFromSWapi> = await response.json();

            let newPerson = new People();
            newPerson.name = personFromSWapi.name;
            newPerson.height = personFromSWapi.height;
            newPerson.mass = personFromSWapi.mass;
            newPerson.hair_color = personFromSWapi.hair_color;
            newPerson.skin_color = personFromSWapi.skin_color;
            newPerson.eye_color = personFromSWapi.eye_color;
            newPerson.birth_year = personFromSWapi.birth_year;
            newPerson.gender = personFromSWapi.gender;
            newPerson.films = await this.dBService.getFilmsFromDBByUrls(personFromSWapi.films);
            newPerson.created = new Date().toISOString();
            newPerson.edited = new Date().toISOString();
            newPerson.url = personFromSWapi.url;

            await this.peopleRepository.save(newPerson);
        } catch (error) {
            console.error('Error downoading people to DB by url:', error);
        }
    }

    async create(data: CreatePeopleDto): Promise<People> {
        try {
            let newPerson = new People();
            newPerson.name = data.name;
            newPerson.height = data.height;
            newPerson.mass = data.mass;
            newPerson.hair_color = data.hair_color;
            newPerson.skin_color = data.skin_color;
            newPerson.eye_color = data.eye_color;
            newPerson.birth_year = data.birth_year;
            newPerson.gender = data.gender;
            newPerson.films = await this.dBService.getFilmsFromDBByUrls(data.films);
            newPerson.created = new Date().toISOString()
            newPerson.edited = new Date().toISOString();
            newPerson.images = await this.dBService.getPeopleImagesFromDBByUrls(data.images);
            if (data.url) {
                newPerson.url = data.url;
                await this.peopleRepository.save(newPerson);
            } else {
                let newPersonId = (await this.peopleRepository.save(newPerson)).id;
                let uniqueUrl = `https://default-domain.dev/api/people/${newPersonId}/`;
                newPerson.url = uniqueUrl;
                await this.peopleRepository.save(newPerson);
            }

            console.log('The person was crated successfully.');
            return newPerson;
        } catch (error) {
            console.error('Error creating person:', error);
        }
    }

    async getObjectsFromThePage(page: number): Promise<People[]> {
        let objectsLimitOnThePage = 10;
        let peopleWithFilms = await this.peopleRepository.find({
            skip: (page - 1) * objectsLimitOnThePage, take: objectsLimitOnThePage,
            relations: ["films"]
        });

        let peopleFullData: PersonFullData[] = peopleWithFilms;

        let peopleShortData = [];

        for (let person of peopleFullData) {
            person.films = person.films.map((film: { url: string } | string) => {
                if (typeof film !== 'string') return film.url;
            });
            peopleShortData.push(person);
        }

        return peopleShortData;
    }

    async getTotal(): Promise<number> {
        return await this.peopleRepository.count();
    }

    async getPerson(personId: number): Promise<PersonFullData> {
        let personWithFilms = await this.peopleRepository.findOne({
            where: { id: personId },
            relations: ["films", "images"]
        });

        let personShortData: PersonFullData = personWithFilms;

        personShortData.films = personShortData.films.map((film: { url: string } | string) => {
            if (typeof film !== 'string') return film.url;
        });
        personShortData.images = personShortData.images.map((image: { url: string } | string) => {
            if (typeof image !== 'string') return image.url;
        })

        return personShortData;
    }

    async update(personId: number, updatedData?: UpdatePeopleDto): Promise<People> {
        try {
            let personToUpdate = await this.peopleRepository.findOneBy({ id: personId });

            personToUpdate.edited = new Date().toDateString();

            let updatedPerson = Object.assign(personToUpdate, updatedData);

            await this.peopleRepository.save(updatedPerson);

            console.log('The person was updated successfully.');

            return await this.peopleRepository.findOneBy({ id: updatedPerson.id });
        } catch (error) {
            console.error('Person updating error:', error);
        }
    }

    async getAllIds(): Promise<number[]> {
        const people = await this.peopleRepository.find();
        return people.map(person => person.id);
    }

    async delete(personId: number): Promise<void> {
        try {
            let personToDelete: People = await this.peopleRepository.findOne({ where: { id: personId } });

            await this.peopleRepository.remove(personToDelete);
            console.log('The person was deleted successfully.');
        } catch (error) {
            console.error('Person delete error:', error);
        }
    }

    async downloadImages(data: ImagesDto, personId: number): Promise<PersonFullData> {
        try {
            let selectedPerson = await this.peopleRepository.findOneBy({ id: personId });
            if (!selectedPerson) throw new Error('Person not found.');

            let personImages = await this.imagesRepository.findBy({ people: selectedPerson });
            let personImageUrls = personImages.map(image => image.url);

            for (let image of data.urls) {
                if (!personImageUrls.includes(image)) {
                    let newImage = new PeopleImages();
                    newImage.url = image;
                    personImages.push(newImage);
                    selectedPerson.images = personImages;
                    await this.peopleRepository.save(selectedPerson);
                    console.log("Images downloaded successfully.");
                }
            }

            return await this.getPerson(personId);
        } catch (error) {
            console.error('Error downloading images:', error);
        }
    }

    async deleteImage(personId: number, imageId: number): Promise<PersonFullData> {
        try {
            let selectedPerson = await this.peopleRepository.findOneBy({ id: personId });
            let imagesForDelete = await this.imagesRepository.findBy({ people: selectedPerson });
            let imageForDelete: PeopleImages;
            imagesForDelete.forEach(image => {
                if (image.id === imageId) {
                    imageForDelete = image;
                }
            })
            if (imageForDelete) {
                await this.imagesRepository.remove(imageForDelete);
            }

            console.log("Images deleted successfully.");
            return await this.getPerson(personId);
        } catch (error) {
            console.log('Error deleting image:', error)
        }
    }

    async getAllImageIds(): Promise<number[]> {
        let allImages = await this.imagesRepository.find();
        let allImagIds = allImages.map(image => image.id);
        return allImagIds;
    }

    async getAllImages(): Promise<PeopleImages[]> {
        return await this.imagesRepository.find();
    }

    async includesImage(images: ImagesDto, personId: number): Promise<boolean> {
        let selectedPerson = await this.peopleRepository.findOneBy({ id: personId });
        let allImages = await this.imagesRepository.findBy({ people: selectedPerson });
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
