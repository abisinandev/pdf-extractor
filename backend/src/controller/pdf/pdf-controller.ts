import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../configs/app.error";
import { MESSAGES } from "../../configs/messages.constants";
import { IPdfController } from "../interfaces/pdf-controller.interface";
import { IPdfService } from "../../services/interfaces/pdf-service.interface";
import { IExtractPdfService } from "../../services/interfaces/extract-pdf-service.interface";
import { responseHeader } from "../../utils/response-header.utils";

export class PdfController implements IPdfController {

    constructor(
        private readonly _pdfService: IPdfService,
        private readonly _extractPdfService: IExtractPdfService,
    ) { }

    uploadPdf = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const fileId = req.file?.filename;
            console.log(req.file, fileId);

            return res.status(HttpStatusCode.Accepted).json({
                success: true,
                message: MESSAGES.PDF.UPLOADED,
                fileId,
            });
        } catch (error) {
            next(error);
        }
    };

    getPdf = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { fileId } = req.params;
            console.log("Fetching PDF file ID: ", fileId);

            const result = await this._pdfService.extractText(fileId as string);
            if (!result) {
                throw new AppError(
                    HttpStatusCode.NotFound,
                    MESSAGES.PDF.NOT_FOUND
                );
            }

            return res.status(HttpStatusCode.Ok).json({
                success: true,
                message: MESSAGES.PDF.FETCHED,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    extractPdf = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { id: fileName } = req.params;
            const { pages } = req.body;

            const result = await this._extractPdfService.extract(fileName as string, pages);

            //set content types
            responseHeader(res);

            return res.send(result);

        } catch (error) {
            next(error);
        }
    }
} 