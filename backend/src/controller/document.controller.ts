import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response } from "express";
import { MESSAGES } from "../constants/messages.constants";
import { IDocumentSerice } from "../services/interfaces/document-service.interface";
import { responseHeader } from "../utils/response-header.utils";


/**
 * Handling document upload and extract API requests.
 * using strategy pattern for upload document
 * 
 * Responsibilites:
 * - Recieves and validate client requests.
 * - Delegate into to DocumentServices.
 * - Return HTTP response.
 * - Forward unexpected errors to the global error handler.
 */

export class DocumentController {

    constructor(
        private readonly _documentService: IDocumentSerice,
    ) { }

    async upload(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {

            const result = await this._documentService.upload(req.file as Express.Multer.File);

            return res.status(HttpStatusCode.Created).json({
                success: true,
                message: MESSAGES.DOC.UPLOADED,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    async getDocument(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { fileId } = req.params;
            console.log("Fetching PDF file ID: ", fileId);

            const result = await this._documentService.extract(fileId as string, []);

            return res.status(HttpStatusCode.Ok).json({
                success: true,
                message: MESSAGES.DOC.FETCHED,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    extractDocument = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { id: storagePath } = req.params;
            const { pages, filename } = req.body;

            const result = await this._documentService.extract(storagePath as string, pages);

            //set content types
            responseHeader(res, filename);

            return res.send(result);

        } catch (error) {
            next(error);
        }
    }
} 