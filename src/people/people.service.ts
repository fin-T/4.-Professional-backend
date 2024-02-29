import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { People } from './entities/people.entity';
import { PeopleImages } from './entities/peopleImages.entity';
import { ImagesDto } from 'src/common/dto/images.dto';
import { Service } from 'src/common/interfaces/service.interface';
import { DBService } from 'src/db/dB.service';

@Injectable()
export class PeopleService implements Service<People>{

    constructor(
        @InjectRepository(People)
        private peopleRepository: Repository<People>,
        @InjectRepository(PeopleImages)
        private imagesRepository: Repository<PeopleImages>,
        private readonly dBService: DBService,
    ) { }

    async includes(name: string): Promise<boolean> {
        return !!(await this.peopleRepository.findOne({ where: { name: name } }));
    }

    async create(data: Partial<People> | string): Promise<People> {

        try {
            if (typeof data === 'string') {
                let response = await fetch(data);
                let newPerson = await response.json();
                return newPerson;
            } else {
                let newPerson = new People();
                newPerson.name = data.name;
                newPerson.height = data.height;
                newPerson.mass = data.mass;
                newPerson.hair_color = data.hair_color;
                newPerson.skin_color = data.skin_color;
                newPerson.eye_color = data.eye_color;
                newPerson.birth_year = data.birth_year;
                newPerson.gender = data.gender;
                // let planets = await this.dBService.getPlanets([personOrUrl.homeworld]);
                // newPerson.homeworld = planets[0] ? planets[0] : undefined;
                newPerson.films = await this.dBService.getFilms(data.films);
                // newPerson.species = await this.dBService.getSpecies(personOrUrl.species);
                // newPerson.vehicle = await this.dBService.getVehicles(personOrUrl.vehicle);
                // newPerson.starships = await this.dBService.getStarships(personOrUrl.starships);
                newPerson.created = data.created;
                newPerson.edited = data.edited;
                newPerson.url = newPerson
                // newPerson.images = data.images || [];
                return newPerson;
            }
        } catch (error) {
            console.error('Error creating person:', error);
        }
    }

    async save(person: Partial<People>): Promise<void> {
        try {
            await this.peopleRepository.save(person);
            console.log('The person was saved successfully.');
        } catch (error) {
            console.error('Error saving person:', error);
        }
    }

    async getObjectsFromThePage(page: number): Promise<People[]> {
        let peopleLimitOnThePage = 10;
        return await this.peopleRepository.find({ skip: (page - 1) * peopleLimitOnThePage, take: peopleLimitOnThePage });
    }

    async getTotal(): Promise<number> {
        return await this.peopleRepository.count();
    }

    async update(id: number, updatedData?: Partial<People>): Promise<People> {
        try {
            let personToUpdate = await this.peopleRepository.findOne({ where: { id: id } });

            let updatedPerson = await this.create(updatedData);

            updatedPerson = Object.assign(personToUpdate, updatedPerson);

            await this.peopleRepository.save(updatedPerson);

            console.log('The person was updated successfully.');
            return await this.peopleRepository.findOne({ where: { id: updatedPerson.id } });
        } catch (error) {
            console.error('Person updating error:', error);
        }
    }

    async getAllIds(): Promise<number[]> {
        const people = await this.peopleRepository.find();
        return people.map(person => person.id);
      }

    async delete(id: number): Promise<void> {
        try {
            let personToDelete: People = await this.peopleRepository.findOne({ where: { id: id } });

            await this.peopleRepository.remove(personToDelete);
            console.log('The person was deleted successfully.');
        } catch (error) {
            console.error('Person delete error:', error);
        }
    }

    async downloadImages(data: ImagesDto, personId: number): Promise<void> {
        try {
            let selectedPerson = await this.peopleRepository.findOne({ where: { id: personId } });
            if (!selectedPerson) throw new Error('Person not found.');

            let personImages = await this.imagesRepository.find({ where: { people: selectedPerson } });
            let personImageUrls = personImages.map(image => image.url);

            for (let image of data.urls) {
                if (!personImageUrls.includes(image)) {
                    let newImage = new PeopleImages();
                    newImage.url = image;
                    personImages.push(newImage);
                    selectedPerson.images = personImages;
                    await this.peopleRepository.save(selectedPerson);
                }
            }

            console.log("Images downloaded successfully.");
        } catch (error) {
            console.error('Error downloading images:', error);
        }
    }

    async deleteImage(personId: number, imageId: number): Promise<void> {
        try {
            let selectedPerson = await this.peopleRepository.findOne({ where: { id: personId } });
            let imagesForDelete = await this.imagesRepository.find({ where: { people: selectedPerson } });
            let imageForDelete: PeopleImages;
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
