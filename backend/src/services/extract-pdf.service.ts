import { IExtractPdfService } from "./interfaces/extract-pdf-service.interface";
import { PDFDocument } from "pdf-lib";
import fs from 'fs/promises';
import path from 'path';
import { AppError } from "../configs/app.error";
import { HttpStatusCode } from "axios";

export class ExtractPdfService implements IExtractPdfService {

    async extract(fileName: string, pages: []): Promise<Buffer> {

        const filePath = path.join(
            process.cwd(),
            "uploads",
            fileName,
        );

        const existingPdfFile = await fs.readFile(filePath);
        const sourcePdf = await PDFDocument.load(existingPdfFile);

        const totalPages = sourcePdf.getPageCount();

        pages.forEach(page => {
            if (page < 1 || page > totalPages) {
                throw new AppError(HttpStatusCode.BadRequest, "Invalid number");
            }
        })

        const newPdf = await PDFDocument.create();

        const copiedPages = await newPdf.copyPages(
            sourcePdf,
            pages.map((p) => p - 1)
        );

        copiedPages.forEach((page) =>
            newPdf.addPage(page)
        );

        const pdfBytes =
            await newPdf.save();

        return Buffer.from(pdfBytes);
    }
}