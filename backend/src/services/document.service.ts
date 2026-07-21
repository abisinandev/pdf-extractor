import { IDocumentParser } from "../parser/interface/document-parser.interface";
import { IDocumentSerice } from "./interfaces/document-service.interface";
import { IStorageService } from "./interfaces/storage-service.interface";

/**
 * Document related business operations.
 * 
 * Responsibilities:
 * - Managed document uploading workflow.
 * - Adding docs into supabase database.
 * - Managed document pages extraction.
 * 
*/

export class DocumentService implements IDocumentSerice {

    constructor(
        private readonly _documentParser: IDocumentParser,
        private readonly _storageService: IStorageService,
    ) { }

    async upload(file: Express.Multer.File) {

        const storagePath = await this._storageService.upload(file);

        const fileBuffer = await this._storageService.download(storagePath);
        const extractedText = await this._documentParser.extractText(fileBuffer);

        const document = await this._storageService.create({
            originalName: file.originalname,
            mimeType: file.mimetype,
            storagePath,
            extractedText
        });

        return document;

    }

    async extract(storagePath: string, pages: []): Promise<Buffer> {

        const fileBuffer = await this._storageService.download(storagePath);
        const parsed = await this._documentParser.extract(fileBuffer, pages);
        return parsed;
    }
}
