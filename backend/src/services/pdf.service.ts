import fs from "fs";
import pdfParser from "pdf-parse";
import { IPdfService } from "./interfaces/pdf-service.interface";
import { getFilePath } from "../utils/file-upload.utils";

export class PdfService implements IPdfService {

    public async extractText(fileId: string): Promise<string> {
        const filePath = getFilePath(fileId);

        const exists = fs.existsSync(filePath);
        if (!exists) return ""

        const buffer = fs.readFileSync(filePath);

        const data = await pdfParser(buffer);

        return data.text;
    }
}