import fs from "fs";
import path from "path";
import pdfParser from "pdf-parse";
import { IPdfService } from "./interfaces/pdf-service.interface";

export class PdfService implements IPdfService {
    constructor(
        private readonly uploadDir: string
    ) { }

    public async extractText(fileId: string): Promise<string> {
        const filePath = path.join(
            process.cwd(),
            this.uploadDir,
            fileId
        );
        const exists = fs.existsSync(filePath);
        if (!exists) {
            return "";
        }
        const buffer = fs.readFileSync(filePath);

        const data = await pdfParser(buffer);

        return data.text;
    }
}