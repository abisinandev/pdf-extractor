import { IDocumentParser } from "./interface/document-parser.interface";
import pdfParser from "pdf-parse";
import { HttpStatusCode } from "axios";
import { AppError } from "../configs/app.error";
import { extractedFile } from "../utils/extract-file.util";
import { MESSAGES } from "../constants/messages.constants";

export class PdfParser implements IDocumentParser {

    async extract(buffer: Buffer, pages: []): Promise<Buffer> {
        if (!buffer || buffer.length === 0) {
            throw new AppError(
                HttpStatusCode.NotFound,
                MESSAGES.DOC.NOT_FOUND
            );
        }

        const pdfBytes = await extractedFile(buffer, pages);

        return Buffer.from(pdfBytes);
    }

    async extractText(buffer: Buffer): Promise<string> {
        if (!buffer || buffer.length === 0) return "";

        const data = await pdfParser(buffer);

        return data.text;
    }
}