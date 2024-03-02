export interface Service<T> {
    includes(data: object): Promise<boolean>;

    downloadToDBByUrl(url: string): Promise<void>;

    create(data: object): Promise<T>;

    getObjectsFromThePage(page: number): Promise<T[]>;

    getTotal(): Promise<number>;

    update(tId: number, updatedData?: object): Promise<T>;

    getAllIds(): Promise<number[]>;

    delete(tId: number): Promise<void>;

    downloadImages(data: object, tId: number): object;

    deleteImage(tId: number, imageID: number): object;

    getAllImageIds(): Promise<number[]>;

    getAllImages(): Promise<object[]>;

    includesImage(images: object, id: number): Promise<boolean>;

    getAllImageUrls(): Promise<string[]>;
}