import { IDocumentMetadata, IDocumentRecord } from "../../services/interfaces/storage-service.interface";

export interface IStorageProvider {

    upload(file: Express.Multer.File): Promise<string>;

    download(path: string): Promise<Buffer>;

    delete(path: string): Promise<void>;

    exists(path: string): Promise<boolean>;

    create(data: IDocumentMetadata): Promise<IDocumentRecord>;

    deleteAll(): Promise<void>;
}