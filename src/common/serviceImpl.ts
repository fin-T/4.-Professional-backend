import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OneOfItems, OneOfItemImages } from './../common/types/types';
import { IMAGE_CLASS_MAP, ROOT_URL } from './constants/constants';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

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
   * @param configService A service for getting connect method to aws s3 client.
   * @param itemRepository A repository for interacting with item entities.
   * @param imagesRepository Repository for interacting with image entities.
   * (in fact the url of the image) items.
   */
  constructor(
    private itemRepository: Repository<OneOfItems>,
    public imagesRepository: Repository<OneOfItemImages>,
  ) {}

  /**
   * aws s3 client for working with aws s2 to interact with remote data storage in the cloud.
   */
  private readonly s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  /**
   * Creates a unique value for the url field of the item entity.
   *
   * @param instance An instance of the entity class.
   * @returns A unique reference for the entity.
   */
  async createItemUniqueUrl(instance: OneOfItems): Promise<string> {
    try {
      const item = instance.constructor.name.toLowerCase();

      let maxId = (
        await this.itemRepository
          .createQueryBuilder(``)
          .select(`MAX(id)`, 'maxId')
          .getRawOne()
      ).maxId;

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
      return url
        ? await this.itemRepository.findOne({ where: { url: url } })
        : null;
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
      const responseData: Partial<OneOfItems> = { ...item };
      for (const key in responseData) {
        if (Array.isArray(responseData[key])) {
          responseData[key] = responseData[key].map(
            (item: OneOfItems) => item.url,
          );
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
      const itemToDelete = await this.itemRepository.findOneBy({ id: itemId });

      return itemToDelete
        ? await this.itemRepository.remove(itemToDelete)
        : null;
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  /**
   * Loads image entities for item entities into the database.
   *
   * @param images Images data.
   * @param item The entitie of the item.
   * @returns The entitie of the element's image.
   */
  async downloadItemImages(
    images: Express.Multer.File[],
    item: OneOfItems,
  ): Promise<OneOfItems> {
    try {
      const ImageClass = IMAGE_CLASS_MAP[item.constructor.name];

      const itemKind = item.constructor.name.toLowerCase();
      for (const image of images) {
        const newImage: OneOfItemImages = new ImageClass();

        image.originalname = await this.createNewImageName(
          itemKind,
          image.originalname,
        );

        newImage.url = this.createURLForAWS(image.originalname);
        newImage[itemKind] = item;
        (item.images as OneOfItemImages[]).push(newImage);

        // Saving to aws s3 bucket
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: newImage.url,
            Body: image.buffer,
          }),
        );

        await this.imagesRepository.save(newImage);
      }

      console.log('Images for the item have been successfully downloaded.');

      return item;
    } catch (error) {
      console.error('Error downloading images for item:', error);
    }
  }

  /**
   * Creates unique image name.
   *
   * @param itemKind Kind of itam (people, planets or etc.)
   * @param filename Original file name.
   * @returns Beautiful name for image.
   */
  async createNewImageName(
    itemKind: string,
    filename: string,
  ): Promise<string> {
    const ext = filename.substring(filename.lastIndexOf('.'));
    const maxId =
      (
        await this.imagesRepository
          .createQueryBuilder(``)
          .select(`MAX(id)`, 'maxId')
          .getRawOne()
      ).maxId + 1;

    return maxId ? `${itemKind}_${maxId}${ext}` : `${itemKind}_1${ext}`;
  }

  /**
   * Creates url for aws s3 bucket.
   *
   * @param fileName File name.
   * @returns A URL including the file name.
   */
  createURLForAWS(fileName: string): string {
    return `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;
  }

  /**
   * Deletes an image entity by ID.
   *
   * @param imageId Image entity ID.
   * @returns The deleted element image entity.
   */
  async deleteImage(imageId: number): Promise<OneOfItemImages | null> {
    try {
      const imageToDelete = await this.imagesRepository.findOneBy({
        id: imageId,
      });
      if (!imageToDelete) return null;

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: imageToDelete.url,
        }),
      );

      return imageToDelete
        ? await this.imagesRepository.remove(imageToDelete)
        : null;
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
      const relationPropertyNames = this.itemRepository.metadata.relations.map(
        (relation) => relation.propertyName,
      );

      return typeof searchData === 'number'
        ? await this.itemRepository.findOne({
            where: { id: searchData },
            relations: relationPropertyNames,
          })
        : await this.itemRepository.findOne({
            where: { url: searchData },
            relations: relationPropertyNames,
          });
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
      const relationPropertyNames = this.itemRepository.metadata.relations.map(
        (relation) => relation.propertyName,
      );
      const itemsLimitOnThePage = 10;
      const itemsData = await this.itemRepository.find({
        skip: (page - 1) * itemsLimitOnThePage,
        take: itemsLimitOnThePage,
        relations: relationPropertyNames,
      });

      return itemsData;
    } catch (error) {
      console.error('Error getting people from the page:', error);
    }
  }
}
