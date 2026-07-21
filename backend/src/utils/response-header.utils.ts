import { Response } from "express";

export const responseHeader = (res: Response, filename?: string) => {
    const newFilename = filename?.trim() ? `${filename.trim()}.pdf` : "extracted.pdf";
    res.type("pdf");
    res.attachment(newFilename);
}