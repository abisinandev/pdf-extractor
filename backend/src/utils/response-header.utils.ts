import { Response } from "express";

export const responseHeader = (res: Response) => {
    res.type("pdf");
    res.attachment("extracted.pdf");
}