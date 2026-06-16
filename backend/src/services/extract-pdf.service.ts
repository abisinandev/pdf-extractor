import { IExtractPdfService } from "./interfaces/extract-pdf-service.interface";
import fs from 'fs/promises';
import { AppError } from "../configs/app.error";
import { HttpStatusCode } from "axios";
import { getFilePath } from "../utils/file-upload.utils";
import { extractedFile } from "../utils/extract-file.util";

export class ExtractPdfService implements IExtractPdfService {

    async extract(fileName: string, pages: []): Promise<Buffer> {

        const filePath = getFilePath(fileName);

        try {
            await fs.access(filePath);
        } catch {
            throw new AppError(
                HttpStatusCode.NotFound,
                "PDF file not found"
            );
        }

        const pdfBytes = await extractedFile(filePath, pages);

        return Buffer.from(pdfBytes);
    }
}