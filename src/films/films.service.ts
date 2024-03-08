import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Films } from './entities/films.entity';
import { FilmsImages } from './entities/filmsImages.entity';
import { CreateFilmsDto } from './dto/create_films.dto';
import { UpdateFilmsDto } from './dto/update_films.dto';
import { ItemsServiceImpl } from 'src/items/items.service';
import { CommonService } from 'src/common/common.service';
import { OneOfResponseTypes } from 'src/common/types/types';
console.log('FilmsService');

@Injectable()
export class FilmsService extends ItemsServiceImpl<Films> {

    constructor(
        @InjectRepository(Films)
        public filmsRepository: Repository<Films>,
        @InjectRepository(FilmsImages)
        public imagesRepository: Repository<FilmsImages>,
        public readonly commonService: CommonService
    ) {
        super(filmsRepository, imagesRepository, commonService);
    }

    async downloadToDBByUrl(url: string): Promise<void> {
        try {
            let response = await fetch(url);
            let itemFromUrl: Partial<CreateFilmsDto> = await response.json();

            let newItem = new Films();
            Object.assign(newItem, itemFromUrl);

            newItem.characters = await this.commonService.getPeopleFromDBByUrls(itemFromUrl.characters);
            newItem.planets = await this.commonService.getPlanetsFromDBByUrls(itemFromUrl.planets);
            newItem.species = await this.commonService.getSpecieFromDBByUrls(itemFromUrl.species);
            newItem.created = new Date().toISOString();
            newItem.edited = new Date().toISOString();

            await this.filmsRepository.save(newItem);
        } catch (error) {
            console.error('Error downoading film to DB by url:', error);
        }
    }

    async create(data: CreateFilmsDto): Promise<OneOfResponseTypes> {
        try {
            let newItem = new Films();

            Object.assign(newItem, data);

            if (!data.url) newItem.url = await this.createItemUniqueUrl(newItem);

            newItem.created = new Date().toISOString();

            let savedNewItem = await this.filmsRepository.save(newItem);

            console.log('The film was created successfully.');

            return await this.update(savedNewItem.id, data);
        } catch (error) {
            console.error('Error creating film:', error);
        }
    }

    async update(id: number, updatedData?: UpdateFilmsDto): Promise<OneOfResponseTypes> {
        try {
            let itemToUpdate = await this.filmsRepository.findOneBy({ id: id });

            itemToUpdate.characters = await this.commonService.getPeopleFromDBByUrls(updatedData.characters);
            itemToUpdate.planets = await this.commonService.getPlanetsFromDBByUrls(updatedData.planets);
            itemToUpdate.species = await this.commonService.getSpecieFromDBByUrls(updatedData.species);
            itemToUpdate.edited = new Date().toDateString();

            let updatedItem = Object.assign(itemToUpdate, updatedData);
            let imageUrls = updatedItem.images.map(image => image.url);
            itemToUpdate.images = await this.commonService.getFilmsImagesFromDBByUrls(imageUrls);
            await this.filmsRepository.save(updatedItem);

            console.log('The film was updated successfully.');

            return await this.setItemDataForResponse(updatedItem.id);
        } catch (error) {
            console.error('Film updating error:', error);
        }
    }
}