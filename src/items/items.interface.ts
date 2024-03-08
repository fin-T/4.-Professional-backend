import { ImagesDto } from "src/common/dto/images.dto";
import { 
    AllCreateItemsDto, OneOfCreateItemsDto, OneOfResponseTypes, OneOfItemTypes, OneOfUpdateItemsDto, OneOfItemImagesTypes 
} from "src/common/types/types";
import { DeleteResult } from "typeorm";
console.log('ItemsService');

export interface ItemsService<T> {

    includes(data: AllCreateItemsDto): Promise<boolean>;

    // create(data: OneOfCreateItemsDto): Promise<OneOfResponseTypes>

    createItemUniqueUrl(currentItem: OneOfItemTypes): Promise<string>;

    isItemUrlExists(url?: string): Promise<boolean>;

    getItemNonExistingUrls(itemUrls: string[]): Promise<string[]>;

    getTotal(): Promise<number>;

    getItemImageIds(item: OneOfItemTypes): number[];

    getItemsFromThePage(page: number): Promise<OneOfResponseTypes[]>;

    setItemDataForResponse(item: OneOfItemTypes): Promise<OneOfResponseTypes>;

    // update(itemId: number, updatedData?: OneOfUpdateItemsDto): Promise<OneOfResponseTypes>;

    getAllItemIds(): Promise<number[]>;

    deleteItem(itemId: number): Promise<DeleteResult>;

    downloadItemImages(imagesData: ImagesDto, item: OneOfItemTypes): Promise<void>;

    deleteItemImage(itemId: number, imageId: number): Promise<void>;
} 