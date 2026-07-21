import { randomUUID } from "crypto";
import path from "path";
import { HttpStatusCode } from "axios";
import { IStorageProvider } from "./interface/storage-provider.interface";
import { supabase } from "../configs/supabase.configs";
import { ENV } from "../configs/env.constants";
import { AppError } from "../configs/app.error";
import { MESSAGES } from "../constants/messages.constants";
import { IDocumentMetadata, IDocumentRecord } from "../services/interfaces/storage-service.interface";

export class SupabaseStorageProvider implements IStorageProvider {

    private readonly bucket = ENV.SUPABASE_BUCKET_NAME;

    async upload(file: Express.Multer.File): Promise<string> {

        const extension = path.extname(file.originalname);

        const filePath = `${randomUUID()}${extension}`;

        const { error } = await supabase.storage
            .from(this.bucket)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            throw new AppError(HttpStatusCode.InternalServerError, `${MESSAGES.STORAGE.UPLOAD_FAILED}: ${error.message}`);
        }

        return filePath;
    }

    async download(filePath: string): Promise<Buffer> {

        const { data, error } = await supabase.storage
            .from(this.bucket)
            .download(filePath);

        if (error || !data) {
            throw new AppError(HttpStatusCode.NotFound, MESSAGES.STORAGE.NOT_FOUND);
        }

        const arrayBuffer = await data.arrayBuffer();

        return Buffer.from(arrayBuffer);
    }

    async delete(filePath: string): Promise<void> {

        const { error } = await supabase.storage
            .from(this.bucket)
            .remove([filePath]);

        if (error) {
            throw new AppError(HttpStatusCode.InternalServerError, `${MESSAGES.STORAGE.DELETE_FAILED}: ${error.message}`);
        }
    }

    async exists(filePath: string): Promise<boolean> {

        const folder = path.dirname(filePath);
        const fileName = path.basename(filePath);

        const { data, error } = await supabase.storage
            .from(this.bucket)
            .list(folder === "." ? "" : folder);

        if (error) {
            return false;
        }

        return data.some(file => file.name === fileName);
    }

    async create(data: IDocumentMetadata): Promise<IDocumentRecord> {
        const { data: result, error } = await supabase
            .from("documents")
            .insert([
                {
                    original_name: data.originalName,
                    mime_type: data.mimeType,
                    storage_path: data.storagePath,
                    extracted_text: data.extractedText,
                }
            ])
            .select()
            .single();

        if (error) {
            throw new AppError(HttpStatusCode.InternalServerError, `Failed to save metadata: ${error.message}`);
        }

        return result;
    }

    async deleteAll(): Promise<void> {
        // Delete all records from the documents table
        const { error: dbError } = await supabase
            .from("documents")
            .delete()
            .not("id", "is", null);

        if (dbError) {
            console.error("Failed to delete database records:", dbError);
        }

        const { data: files, error: listError } = await supabase.storage
            .from(this.bucket)
            .list();

        if (listError) {
            console.error("Failed to list storage files:", listError);
        } else if (files && files.length > 0) {
            const filePaths = files.map((file) => file.name);
            const { error: removeError } = await supabase.storage
                .from(this.bucket)
                .remove(filePaths);

            if (removeError) {
                console.error("Failed to remove storage files:", removeError);
            }
        }
    }
}