import { PDFDocument } from "pdf-lib";

export const extractedFile = async (data: Buffer, pages: []) => {
    const sourcePdf = await PDFDocument.load(data);

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