import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Species } from './entities/species.entity';
import { Repository } from 'typeorm';
import { SpeciesImages } from './entities/speciesImages.entity';
import { ItemsServiceImpl } from 'src/items/items.service';
import { CreateSpeciesDto } from './dto/create_species.dto';
import { CommonService } from 'src/common/common.service';
import { OneOfResponseTypes } from 'src/common/types/types';
import { UpdateSpeciesDto } from './dto/update_spacies.dto';
console.log('SpeciesService')

@Injectable()
export class SpeciesService extends ItemsServiceImpl<Species>{

    constructor(
        @InjectRepository(Species)
        public speciesRepository: Repository<Species>,
        @InjectRepository(SpeciesImages)
        public imagesRepository: Repository<SpeciesImages>,
        public commonService: CommonService,
    ) {
        super(speciesRepository, imagesRepository, commonService)
    }

    async downloadToDBByUrl(url: string): Promise<void> {
        try {
            let response = await fetch(url);
            let itemFromUrl: Partial<CreateSpeciesDto> = await response.json();

            let newItem = new Species();
            Object.assign(newItem, itemFromUrl);

            newItem.homeworld = (await this.commonService.getPlanetsFromDBByUrls([itemFromUrl.homeworld]))[0]
            newItem.people = await this.commonService.getPeopleFromDBByUrls(itemFromUrl.people);
            newItem.films = await this.commonService.getFilmsFromDBByUrls(itemFromUrl.films);
            newItem.created = new Date().toISOString();
            newItem.edited = new Date().toISOString();

            await this.speciesRepository.save(newItem);
        } catch (error) {
            console.error('Error downoading specie to DB by url:', error);
        }
    }

    async create(data: CreateSpeciesDto): Promise<OneOfResponseTypes> {
        try {
            let newItem = new Species();

            Object.assign(newItem, data);

            if (!data.url) newItem.url = await this.createItemUniqueUrl(newItem);

            newItem.created = new Date().toISOString();

            let savedNewItem = await this.speciesRepository.save(newItem);

            console.log('The specie was created successfully.');

            return await this.update(savedNewItem.id, data);
        } catch (error) {
            console.error('Error creating specie:', error);
        }
    }

    async update(id: number, updatedData?: UpdateSpeciesDto): Promise<OneOfResponseTypes> {
        try {
            let itemToUpdate = await this.speciesRepository.findOneBy({ id: id });

            itemToUpdate.homeworld = updatedData.homeworld ?
                await this.commonService.getPeopleFromDBByUrls([updatedData.homeworld])[0] : null;
            itemToUpdate.people = await this.commonService.getPeopleFromDBByUrls(updatedData.people);
            itemToUpdate.films = await this.commonService.getFilmsFromDBByUrls(updatedData.films);
            itemToUpdate.edited = new Date().toDateString();
            let updatedItem = Object.assign(itemToUpdate, updatedData);
            let imageUrls = updatedItem.images.map(image => image.url);
            itemToUpdate.images = await this.commonService.getSpecieImagesFromDBByUrls(imageUrls);

            await this.speciesRepository.save(updatedItem);

            console.log('The specie was updated successfully.');

            return await this.setItemDataForResponse(updatedItem.id);
        } catch (error) {
            console.error('Specie updating error:', error);
        }
    }
}
