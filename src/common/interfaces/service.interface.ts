import { ImagesDto } from "../dto/images.dto";

export interface Service<T> {

    includes(name: string): Promise<boolean>;

    create(data: Partial<T> | string): Promise<T>;

    save(data: Partial<T>): Promise<void>;

    getObjectsFromThePage(page: number): Promise<T[]>;

    getTotal(): Promise<number>;

    update(id: number, updatedData?: Partial<T>): Promise<T>;

    getAllIds(): Promise<number[]>;

    delete(id: number): Promise<void>;

    downloadImages(data: ImagesDto, personId: number): Promise<void>;

    deleteImage(personId: number, imageId: number): Promise<void>;
}