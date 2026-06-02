import { Router } from "express";
import { ENV } from "../configs/env.constants";
import { upload } from "../middlewares/upload.middleware";
import { PdfController } from "../controller/pdf/pdf-controller";
import { PdfService } from "../services/pdf.service";
import { PDF_ROUTES } from "../configs/router-constants";
import { ExtractPdfService } from "../services/extract-pdf.service";
const router = Router();

const pdfService = new PdfService(ENV.UPLOAD_DIR);
const extractPdfService = new ExtractPdfService();
const pdfController = new PdfController(pdfService, extractPdfService);

router.post(
    PDF_ROUTES.UPLOAD,
    upload.single("pdf"),
    pdfController.uploadPdf
);
router.get(PDF_ROUTES.GET_PDF, pdfController.getPdf);

router.post(PDF_ROUTES.EXTRACT_PDF, pdfController.extractPdf);

export default router 