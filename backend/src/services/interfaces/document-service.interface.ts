import { IDocumentRecord } from "./storage-service.interface";

export interface IDocumentSerice {
    upload(file: Express.Multer.File): Promise<IDocumentRecord>;
    extract(storagePath: string, pages: []): Promise<Buffer>;
}
