import { Injectable } from '@nestjs/common';
import { ImagesDto } from 'src/common/dto/images.dto';
import { Films } from 'src/films/entities/films.entity';
import { People } from 'src/people/entities/people.entity';
import { Planets } from 'src/planets/entities/planets.entity';
import { DeleteResult, Repository } from 'typeorm';
import { PeopleImages } from 'src/people/entities/peopleImages.entity';
import { FilmsImages } from 'src/films/entities/filmsImages.entity';
import { PlanetsImages } from 'src/planets/entities/planetsImages.entity';
import { ItemsService } from './items.interface';
import {
    OneOfCreateItemsDto, OneOfResponseTypes, OneOfItemTypes, OneOfAllTypes, OneOfItemImagesTypes, OneOfUpdateItemsDto, ItemImagesTypes, TypeOfItemImageTypes
} from 'src/common/types/types';
import { ROOT_URL } from 'src/common/constants';
import { Species } from 'src/species/entities/species.entity';
import { SpeciesImages } from 'src/species/entities/speciesImages.entity';

console.log('ItemsServiceImpl');

@Injectable()
export class ItemsServiceImpl<T> implements ItemsService<T> {

    constructor(
        private repository: Repository<OneOfItemTypes>,
        public imagesRepository: Repository<OneOfItemImagesTypes>,
    ) { }

    async includes(data: OneOfCreateItemsDto): Promise<boolean> {
        try {
            if (data.url) return !!(await this.repository.findOneBy({ url: data.url }));
            return false;
        } catch (error) {
            console.error('Error checking for including item:', error);
        }
    }

    getItemUrls(items: OneOfAllTypes[]): string[] {
        return items.map(item => item.url)
    }

    async createItemUniqueUrl(instance: OneOfItemTypes): Promise<string> {
        try {
            let item = instance.constructor.name;

            let maxId = (await this.repository.createQueryBuilder(``)
                .select(`MAX(id)`, 'maxId')
                .getRawOne()).maxId;

            let uniqueUrl = `${ROOT_URL}${item}/${++maxId}/`;

            while (await this.isItemUrlExists(uniqueUrl)) {
                uniqueUrl = `${ROOT_URL}${item}/${++maxId}/`;
            }

            return uniqueUrl;
        } catch (error) {
            console.error('Error getting unique url:', error);
        }
    }

    async isItemUrlExists(url: string): Promise<boolean> {
        try {
            let items = await this.repository.find();
            let itemUrls = items.map(item => item.url);

            return itemUrls.includes(url);
        } catch (error) {
            console.error('Error checking url to exist:', error);
        }
    }

    async getItemNonExistingUrls(searchUrls: string[]): Promise<string[]> {
        try {
            let urls = (await this.repository.find()).map(item => item.url);
            let unexistUrls = searchUrls.filter(url => !urls.includes(url));

            return unexistUrls;
        } catch (error) {
            console.error('Error getting non-existent links:', error);
        }
    }

    async getTotal(): Promise<number> {
        try {
            return await this.repository.count();
        } catch (error) {
            console.error('Error getting total items:', error);
        }
    }

    getItemImageIds(item: OneOfItemTypes): number[] {
        return item.images.map((image: OneOfItemImagesTypes) => image.id);
    }

    async setItemDataForResponse(item: OneOfItemTypes): Promise<OneOfResponseTypes> {
        try {
            let responseData: OneOfResponseTypes;
            for (let key in item) {
                if (!item[key]) {
                    responseData[key] = null;
                    continue;
                }
                let elem = item[key];
                if (Array.isArray(elem)) responseData[key] = this.getItemUrls(elem);
                if (key === 'homeworld') responseData[key] = this.getItemUrls([elem]);
            }

            return responseData;
        } catch (error) {
            console.log('Error getting item:', error);
        }
    }

    async getAllItemIds(): Promise<number[]> {
        try {
            let allItems = await this.repository.find();
            return allItems.map(item => item.id);
        } catch (error) {
            console.error('Error getting all items ids:', error);
        }
    }

    async deleteItem(id: number): Promise<DeleteResult> {
        try {
            let result = await this.repository.delete(id);
            result.affected === 0 ?
                console.log('Item not found.') : console.log('The item was deleted successfully.');

            return result;
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }

    async downloadItemImages(imagesData: ImagesDto, item: OneOfItemTypes): Promise<void> {
        try {
            const ImageClass = this.getImageClass(item);

            let fieldNameForItem = item.constructor.name.toLowerCase();
            let imageUrls = [];
            for (let url of imagesData.urls) {
                let newImage = new ImageClass();
                newImage.url = url;
                newImage[fieldNameForItem] = item;
                imageUrls.push(newImage);
            }
            item.images = imageUrls;

            await this.imagesRepository.save(imageUrls);
            console.log('Images for the item have been successfully downloaded.');
        } catch (error) {
            console.error('Error downloading images for item:', error);
        }
    }

    getImageClass(item: OneOfItemTypes): TypeOfItemImageTypes {
        const imageClassesMap = {
            People: PeopleImages,
            Films: FilmsImages,
            Species: SpeciesImages,
            Planets: PlanetsImages
        };

        return imageClassesMap[item.constructor.name];
    }

    async deleteItemImage(itemId: number, imageId: number): Promise<void> {
        try {
            let item = await this.getItem(itemId);
            let itemImages: OneOfItemImagesTypes[] = await this.getItemImages(item);

            let imageForDelete: OneOfItemImagesTypes = this.getImageForDelete(itemImages, imageId);

            await this.imagesRepository.remove(imageForDelete);

            console.log("Item image deleted successfully.");
        } catch (error) {
            console.log('Error deleting item image:', error);
        }
    }

    async getItem(searchData: number | string): Promise<OneOfItemTypes> {
        try {
            let relationPropertyNames = this.repository.metadata.relations.map(relation => relation.propertyName);

            let item = typeof searchData === 'number' ?
                await this.repository.findOne({ where: { id: searchData }, relations: relationPropertyNames }) :
                await this.repository.findOne({ where: { url: searchData }, relations: relationPropertyNames })

            return item;
        } catch (error) {
            console.error('Error getting item:', error);
        }
    }

    async getItemImages(item: OneOfItemTypes): Promise<OneOfItemImagesTypes[]> {
        try {
            let itemImages: OneOfItemImagesTypes[];
            if (item instanceof People) itemImages = await this.imagesRepository.findBy({ people: item });
            if (item instanceof Films) itemImages = await this.imagesRepository.findBy({ films: item });
            if (item instanceof Planets) itemImages = await this.imagesRepository.findBy({ planets: item });
            if (item instanceof Species) itemImages = await this.imagesRepository.findBy({ species: item });
            // if (item instanceof Vehicles) imagesForDelete = await this.imagesRepository.findBy({ vehicles: item });
            // if (item instanceof Starships) imagesForDelete = await this.imagesRepository.findBy({ starships: item });

            return itemImages;
        } catch (error) {
            console.error('Error getting item images:', error);
        }
    }

    getImageForDelete(itemImages: OneOfItemImagesTypes[], imageId: number): OneOfItemImagesTypes {
        let imageForDelete: OneOfItemImagesTypes;
        itemImages.forEach((image: OneOfItemImagesTypes) => {
            if (image.id === imageId) imageForDelete = image;
        })

        return imageForDelete;
    }

    async getItemsFromThePage(page: number): Promise<OneOfResponseTypes[]> {
        try {
            let relationPropertyNames = this.repository.metadata.relations.map(relation => relation.propertyName);
            let itemsLimitOnThePage = 10;
            let itemsData = await this.repository.find({
                skip: (page - 1) * itemsLimitOnThePage, take: itemsLimitOnThePage,
                relations: relationPropertyNames
            });

            let itemsDataForResponse: OneOfResponseTypes[] = [];

            for (let item of itemsData) {
                let itemData: OneOfResponseTypes = await this.setItemDataForResponse(item);
                itemsDataForResponse.push(itemData);
            }

            return itemsDataForResponse;
        } catch (error) {
            console.error('Error getting people from the page:', error);
        }
    }
}
