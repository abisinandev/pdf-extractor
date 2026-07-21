import { Router } from "express";
import { upload } from "../middlewares/upload.middleware";
import { PDF_ROUTES } from "../constants/router-constants";
import { DocumentController } from "../controller/document.controller";
import { DocumentService } from "../services/document.service";
import { PdfParser } from "../parser/pdf-parser";
import { StorageService } from "../services/storage.service";
import { SupabaseStorageProvider } from "../provider/storage.provider";
import { validateDocument } from "../middlewares/validation.middleware";
const router = Router();


/**
 * Application routes
 * 
 * Responsibilites:
 * - Injecting together the concrete implementations of dependecies.
 * - Controller recieve services, services recieves providers
 * 
*/

const documentParser = new PdfParser();
const storageProvider = new SupabaseStorageProvider()
const storageService = new StorageService(storageProvider);
const documentService = new DocumentService(
    documentParser,
    storageService
);
const controller = new DocumentController(documentService);

router.post(
    PDF_ROUTES.UPLOAD,
    upload.single("document"),
    validateDocument,
    controller.upload.bind(controller)
);
router.get(PDF_ROUTES.GET_PDF, controller.getDocument);

router.post(PDF_ROUTES.EXTRACT_PDF, controller.extractDocument);

export default router