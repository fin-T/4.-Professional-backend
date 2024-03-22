import { Injectable } from '@nestjs/common';
import { ImagesDto } from './../common/dto/images.dto';
import { Repository } from 'typeorm';
import { OneOfItems, OneOfItemImages } from './../common/types/types';
import { IMAGE_CLASS_MAP, ROOT_URL } from './constants/constants';

console.log('ItemsServiceImpl');

/**
 * A class for interacting with entities defined by one of the item structures (People, Films, Planets,
 * Species, Vehicles, Starships) and with image entities of database items, respectively (PeopleImages,
 * FilmsImages, PlanetsImages, SpeciesImages, VehiclesImages, StarshipsImages).
 */
@Injectable()
export class ServiceImpl {
    /**
     *  Constructor for initializing repositories.
     * 
     * @param itemRepository A repository for interacting with item entities.
     * @param imagesRepository Repository for interacting with image entities.
     * (in fact the url of the image) items.
     */
    constructor(
        private itemRepository: Repository<OneOfItems>,
        public imagesRepository: Repository<OneOfItemImages>,
    ) { }

    /**
     * Creates a unique value for the url field of the item entity.
     * 
     * @param instance An instance of the entity class.
     * @returns A unique reference for the entity.
     */
    async createItemUniqueUrl(instance: OneOfItems): Promise<string> {
        try {
            let item = instance.constructor.name.toLowerCase();

            let maxId = (await this.itemRepository.createQueryBuilder(``)
                .select(`MAX(id)`, 'maxId')
                .getRawOne()).maxId;

            let uniqueUrl = `${ROOT_URL}/${item}/${++maxId}/`;

            while (await this.isItemUrlExists(uniqueUrl)) {
                uniqueUrl = `${ROOT_URL}/${item}/${++maxId}/`;
            }

            return uniqueUrl;
        } catch (error) {
            console.error('Error getting unique url:', error);
        }
    }

    /**
     * Checks the presence of an entity by url.
     * 
     * @param url Searched url.
     * @returns It is true if the entity exists, otherwise it is a lie.
     */
    async isItemUrlExists(url?: string): Promise<OneOfItems> {
        try {
            return url ? await this.itemRepository.findOne({ where: { url: url } }) : null;
        } catch (error) {
            console.error('Error checking item url to exist:', error);
        }
    }

    /**
     * Configures entity data to respond to the client. The values of the fields where the entities are 
     * located are replaced to the values of the url fields of these entities.
     * 
     * @param item The entity of the item.
     * @returns The entity of the item, with the values of the fields where the entities were located 
     * changed to the values of the url fields of these entities.
     */
    setItemDataForResponse(item: OneOfItems): Partial<OneOfItems> {
        try {
            let responseData: Partial<OneOfItems> = {...item};
            // Object.assign(responseData, item);
            for (let key in responseData) {
                if (Array.isArray(responseData[key])) {
                    responseData[key] = responseData[key].map((item: OneOfItems) => item.url);
                    continue;
                }
                if (key === 'homeworld' && responseData[key]) {
                    responseData[key] = responseData[key].url;
                }
            }
            return responseData;
        } catch (error) {
            console.log('Error setting item for response:', error);
        }
    }

    /**
     * Removes the item entity selected by ID from the database.
     * 
     * @param itemId Item entity identifier.
     * @returns The deleted item entity.
     */
    async deleteItem(itemId: number): Promise<OneOfItems | null> {
        try {
            let itemToDelete = await this.itemRepository.findOneBy({ id: itemId });

            return itemToDelete ? await this.itemRepository.remove(itemToDelete) : null;
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }

    /**
     * Loads image entities for item entities into the database.
     * 
     * @param imagesData Images data.
     * @param item The entitie of the item.
     * @returns The entitie of the element's image.
     */
    async downloadItemImages(imagesData: ImagesDto,
        item: OneOfItems): Promise<OneOfItems> {
        try {
            // const ImageClass = this.getImageClass(item);
            const ImageClass = IMAGE_CLASS_MAP[item.constructor.name];

            let fieldNameForItem = item.constructor.name.toLowerCase();
            let imageUrls: OneOfItemImages[] = [];
            for (let url of imagesData.urls) {
                let newImage: OneOfItemImages = new ImageClass();
                newImage.url = url;
                newImage[fieldNameForItem] = item;
                imageUrls.push(newImage);
            }
            (item.images as OneOfItemImages[]).push(...imageUrls);

            console.log('Images for the item have been successfully downloaded.');

            await this.imagesRepository.save(imageUrls);

            return item;
        } catch (error) {
            console.error('Error downloading images for item:', error);
        }
    }

    // /**
    //  * Gets the class of the image entity according to the item's entity.
    //  * 
    //  * @param item The entitie of the item.
    //  * @returns The element's image entity class.
    //  */
    // getImageClass(item: OneOfItems): OneOfTypeOfItemImages {
    //     const imageClassesMap = {
    //         People: PeopleImages,
    //         Films: FilmsImages,
    //         Planets: PlanetsImages,
    //         Species: SpeciesImages,
    //         Vehicles: VehiclesImages,
    //         Starships: StarshipsImages
    //     };

    //     return imageClassesMap[item.constructor.name];
    // }

    /**
     * Deletes an image entity by ID.
     * 
     * @param imageId Image entity ID.
     * @returns The deleted element image entity.
     */
    async deleteImage(imageId: number): Promise<OneOfItemImages | null> {
        try {
            let imageToDelete = await this.imagesRepository.findOneBy({ id: imageId });
            return imageToDelete ? await this.imagesRepository.remove(imageToDelete) : null;
        } catch (error) {
            console.log('Error deleting item image:', error);
        }
    }

    /**
     * Getting the entity of an item by the value of the identifier or url field.
     * 
     * @param searchData Item ID or url.  
     * @returns The entity of the item, or null if the entity was not found.
     */
    async getItem(searchData: number | string): Promise<OneOfItems | null> {
        try {
            let relationPropertyNames = this.itemRepository.metadata.relations.map(relation => relation.propertyName);

            return typeof searchData === 'number' ?
                await this.itemRepository.findOne({
                    where: { id: searchData },
                    relations: relationPropertyNames
                }) :
                await this.itemRepository.findOne({
                    where: { url: searchData },
                    relations: relationPropertyNames
                })
        } catch (error) {
            console.error('Error getting item:', error);
        }
    }

    /**
     * Gets the item entity image entity by ID.
     * 
     * @param imageId Image entity ID.
     * @returns The image entity, or null if the entity is not found.
     */
    async getImage(imageId: number): Promise<OneOfItemImages> {
        return await this.imagesRepository.findOneBy({ id: imageId });
    }

    /**
     * Gets 10 item entities starting from (passed value - 1) * 10.
     * If page = 1 - the first 10 item entities from the database will be retrieved. page = 2 - second 10, etc.
     * 
     * @param page Coefficient for determining the number of missing item entities.
     * @returns 10 item entities.
     */
    async getItemsFromThePage(page: number): Promise<OneOfItems[]> {
        try {
            let relationPropertyNames = this.itemRepository.metadata.relations.map(relation => relation.propertyName);
            let itemsLimitOnThePage = 10;
            let itemsData = await this.itemRepository.find({
                skip: (page - 1) * itemsLimitOnThePage, take: itemsLimitOnThePage,
                relations: relationPropertyNames
            });

            return itemsData;
        } catch (error) {
            console.error('Error getting people from the page:', error);
        }
    }
}