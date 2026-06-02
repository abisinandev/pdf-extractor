import { Request, Response, NextFunction } from "express";

export interface IPdfController {
    uploadPdf(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    getPdf(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    extractPdf(req: Request, res: Response, next: NextFunction): Promise<Response | void>
}
