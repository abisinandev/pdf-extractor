import { PDFDocument } from "pdf-lib";
import fs from 'fs/promises';

export const extractedFile = async (filePath: string, pages: []) => {
    const pdfFile = await fs.readFile(filePath);
    const sourcePdf = await PDFDocument.load(pdfFile);

    const newPdf = await PDFDocument.create();//create new empty pdf

    //copy those pages from the source pdf
    const copiedPages = await newPdf.copyPages(
        sourcePdf,
        pages.map((p) => p - 1)
    );

    //add into newpdf (empty pdf)
    copiedPages.forEach((page) =>
        newPdf.addPage(page)
    );

    //generate pdf bytes
    const pdfBytes = await newPdf.save();
    
    return pdfBytes
}