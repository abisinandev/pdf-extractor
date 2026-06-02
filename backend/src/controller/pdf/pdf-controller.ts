import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../configs/app.error";
import { MESSAGES } from "../../configs/messages.constants";
import { IPdfController } from "../interfaces/pdf-controller.interface";
import { IPdfService } from "../../services/interfaces/pdf-service.interface";
import { IExtractPdfService } from "../../services/interfaces/extract-pdf-service.interface";

export class PdfController implements IPdfController {

    constructor(
        private readonly pdfService: IPdfService,
        private readonly extractPdfService: IExtractPdfService,
    ) { }

    uploadPdf = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const fileId = req.file?.filename;
            return res.status(HttpStatusCode.Accepted).json({
                success: true,
                message: MESSAGES.PDF.UPLOADED,
                fileId: fileId,
            });
        } catch (error) {
            next(error);
        }
    };

    getPdf = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { fileId } = req.params;
            console.log("Fetching PDF file ID: ", fileId);
            const result = await this.pdfService.extractText(fileId as string);
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

    async extractPdf(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id: fileName } = req.params;
            const { pages } = req.body;

            const result = await this.extractPdfService.extract(fileName as string, pages);

            res.setHeader(
                "Content-Type",
                "application/pdf"
            )

            res.setHeader(
                "Content-Disposition",
                "attachment; filename=extracted.pdf"
            )

            return res.send(result);

        } catch (error) {
            next(error);
        }
    }
}