import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { People } from './entities/people.entity';
import { PeopleImages } from './entities/peopleImages.entity';
import { CreatePeopleDto } from './dto/create_people.dto';
import { UpdatePeopleDto } from './dto/update_people.dto';
import { CommonService } from 'src/common/common.service';
import { ItemsServiceImpl } from 'src/items/items.service';
import { OneOfResponseTypes } from 'src/common/types/types';
import { NEVER } from 'rxjs';
import { Planets } from 'src/planets/entities/planets.entity';
import { Films } from 'src/films/entities/films.entity';
import { Species } from 'src/species/entities/species.entity';
console.log('PeopleService')

@Injectable()
export class PeopleService extends ItemsServiceImpl<People> {

    constructor(
        @InjectRepository(People)
        public peopleRepository: Repository<People>,
        @InjectRepository(PeopleImages)
        public imagesRepository: Repository<PeopleImages>,
        public commonService: CommonService

    ) {
        super(peopleRepository, imagesRepository);
    }

    async create(data: CreatePeopleDto): Promise<OneOfResponseTypes> {
        try {
            let newPerson = new People();

            Object.assign(newPerson, data);

            newPerson.url = data.url || await this.createItemUniqueUrl(newPerson);

            newPerson.homeworld = data.homeworld && data.homeworld?.length > 0 ?
                (await this.commonService.getItemsByUrls(new Planets, [data.homeworld]))[0] : null;

            newPerson.films = data.films && data.films.length > 0 ?
                await this.commonService.getItemsByUrls(new Films, data.films) : null;

            newPerson.species = data.species && data.species.length > 0 ?
                await this.commonService.getItemsByUrls(new Species, data.species) : null;

            // newPeople.vehicles = data.vehicles && data.vehicles.length > 0 ?
            //     await this.commonService.getItemsByUrls(new Vehicles, data.vehicles) : null;

            // newPeople.starships = data.starships && data.starships ? 
            //     await this.commonService.getItemsByUrls(new Starships, data.starships) : null;

            newPerson.created = new Date().toISOString();
            newPerson.edited = new Date().toISOString();

            let savedNewItem = await this.peopleRepository.save(newPerson);

            console.log('The person was crated successfully.');

            return await this.setItemDataForResponse(savedNewItem);
        } catch (error) {
            console.error('Error creating person:', error);
        }
    }

    async update(id: number, updatedData?: UpdatePeopleDto): Promise<OneOfResponseTypes> {
        try {
            let personToUpdate = await this.peopleRepository.findOneBy({ id: id });

            if (!personToUpdate) {
                console.log('Person not found.');
                return null;
            }

            let updatedPerson = Object.assign(personToUpdate, updatedData);

            updatedPerson.homeworld = updatedData.homeworld && updatedData.homeworld.length > 0 ?
                (await this.commonService.getItemsByUrls(new Planets, [updatedData.homeworld]))[0] : null;

            updatedPerson.films = updatedData.films && updatedData.films.length > 0 ?
                await this.commonService.getItemsByUrls(new Films, updatedData.films) : null;

            updatedPerson.species = updatedData.species && updatedData.species.length > 0 ?
                await this.commonService.getItemsByUrls(new Species, updatedData.species) : null;

            // updatedPerson.vehicles = updatedData.vehicles && updatedData.vehicles.length > 0 ? 
            //     await this.commonService.getItemsByUrls(new Vehicles, updatedData.vehicles) : null;

            // updatedPerson.starships = updatedData.starships && updatedData.starships.length > 0 ? 
            //     await this.commonService.getItemsByUrls(new Starships, updatedData.starships) : null;

            updatedPerson.edited = new Date().toISOString();
            await this.peopleRepository.save(updatedPerson);

            console.log('The person was updated successfully.');

            return await this.setItemDataForResponse(updatedPerson);
        } catch (error) {
            console.error('Person updating error:', error);
        }
    }
}
