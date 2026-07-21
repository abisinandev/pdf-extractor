import { IStorageProvider } from "../provider/interface/storage-provider.interface";
import { IStorageService, IDocumentMetadata, IDocumentRecord } from "./interfaces/storage-service.interface";
import { AppError } from "../configs/app.error";
import { HttpStatusCode } from "axios";
import { MESSAGES } from "../constants/messages.constants";

export class StorageService implements IStorageService {
    constructor(
        private readonly _provider: IStorageProvider
    ) { }

    async upload(file: Express.Multer.File): Promise<string> {
        try {

            return await this._provider.upload(file);

        } catch (error) {

            console.log("Upload: ", error);

            throw new AppError(
                HttpStatusCode.InternalServerError,
                MESSAGES.STORAGE.UPLOAD_FAILED
            );
        }
    }

    async download(path: string): Promise<Buffer> {
        try {

            return await this._provider.download(path);

        } catch (error) {

            console.log("Download: ", error);

            throw new AppError(
                HttpStatusCode.NotFound,
                MESSAGES.STORAGE.NOT_FOUND
            );
        }
    }

    async delete(path: string): Promise<void> {
        try {

            return await this._provider.delete(path);

        } catch (error) {

            console.log("Delete: ", error);

            throw new AppError(
                HttpStatusCode.InternalServerError,
                MESSAGES.STORAGE.DELETE_FAILED
            );
        }
    }

    async exists(path: string): Promise<boolean> {
        return this._provider.exists(path);
    }

    async create(data: IDocumentMetadata): Promise<IDocumentRecord> {
        try {

            return await this._provider.create(data);

        } catch (error) {

            console.log("Create: ", error);

            throw new AppError(
                HttpStatusCode.InternalServerError,
                MESSAGES.STORAGE.CREATE_FAILED
            );
        }
    }
}