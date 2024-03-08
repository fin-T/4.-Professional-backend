import { Injectable } from '@nestjs/common';
import { Planets } from './entities/planets.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanetsImages } from './entities/planetsImages.entity';
import { CreatePlanetsDto } from './dto/create_planets.dto';
import { UpdatePlanetsDto } from './dto/update_planets.rto';
import { ItemsServiceImpl } from 'src/items/items.service';
import { CommonService } from 'src/common/common.service';
import { OneOfResponseTypes } from 'src/common/types/types';
console.log('PlanetsService')

@Injectable()
export class PlanetsService extends ItemsServiceImpl<Planets> {

    constructor(
        @InjectRepository(Planets)
        public planetsRepository: Repository<Planets>,
        @InjectRepository(PlanetsImages)
        public imagesRepository: Repository<PlanetsImages>,
        public commonService: CommonService
    ) {
        super(planetsRepository, imagesRepository, commonService)
     }

    async downloadToDBByUrl(url: string): Promise<void> {
        try {
            let response = await fetch(url);
            let itemFromUrl: Partial<CreatePlanetsDto> = await response.json();

            let newItem = new Planets();
            Object.assign(newItem, itemFromUrl);

            newItem.residents = (await this.commonService.getPeopleFromDBByUrls(itemFromUrl.residents));
            newItem.films = await this.commonService.getFilmsFromDBByUrls(itemFromUrl.films);
            newItem.species = await this.commonService.getSpecieFromDBByUrls(itemFromUrl.species);
            newItem.created = new Date().toISOString();
            newItem.edited = new Date().toISOString();

            await this.planetsRepository.save(newItem);
        } catch (error) {
            console.error('Error downoading person to DB by url:', error);
        }
    }

    async create(data: CreatePlanetsDto): Promise<OneOfResponseTypes> {
        try {
            let newItem = new Planets();

            Object.assign(newItem, data);

            if (!data.url) newItem.url = await this.createItemUniqueUrl(newItem);

            newItem.created = new Date().toISOString();

            let savedNewItem = await this.planetsRepository.save(newItem);

            console.log('The planet was created successfully.');

            return await this.update(savedNewItem.id, data);
        } catch (error) {
            console.error('Error creating planet:', error);
        }
    }

    async update(id: number, updatedData?: UpdatePlanetsDto): Promise<OneOfResponseTypes> {
        try {
            let itemToUpdate = await this.planetsRepository.findOneBy({ id: id });

            itemToUpdate.residents = await this.commonService.getPeopleFromDBByUrls(updatedData.residents);
            itemToUpdate.films = await this.commonService.getFilmsFromDBByUrls(updatedData.films)
            itemToUpdate.species = await this.commonService.getSpecieFromDBByUrls(updatedData.species);

            itemToUpdate.edited = new Date().toDateString();

            let updatedItem = Object.assign(itemToUpdate, updatedData);
            let imageUrls = updatedItem.images.map(image => image.url);
            itemToUpdate.images = await this.commonService.getPlanetsImagesFromDBByUrls(imageUrls);
            await this.planetsRepository.save(updatedItem);

            console.log('The planet was updated successfully.');

            return await this.setItemDataForResponse(updatedItem.id);
        } catch (error) {
            console.error('Planet updating error:', error);
        }
    }
}
