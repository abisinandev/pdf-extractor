import { Express } from "express";

export interface IDocumentMetadata {
    originalName: string;
    mimeType: string;
    storagePath: string;
    extractedText?: string;
}

export interface IDocumentRecord {
    id: string;
    created_at: string;
    original_name: string;
    mime_type: string;
    storage_path: string;
    extracted_text?: string;
}

export interface IStorageService {
    upload(file: Express.Multer.File): Promise<string>;

    download(path: string): Promise<Buffer>;

    delete(path: string): Promise<void>;

    exists(path: string): Promise<boolean>;

    create(data: IDocumentMetadata): Promise<IDocumentRecord>;
}