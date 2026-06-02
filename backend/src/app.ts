import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { HttpStatusCode } from "axios";
import pdfRoutes from "./routes/pdf.routes";
import { AppError } from "./configs/app.error";
import { MESSAGES } from "./configs/messages.constants";
import { COMMON_ROUTES } from "./configs/router-constants";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(pdfRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.log("Error middleware: ", err);

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }

    res.status(HttpStatusCode.InternalServerError).json({
        success: false,
        message: MESSAGES.SERVER.INTERNAL_ERROR,
    });
});

app.get(COMMON_ROUTES.HEALTH, (_req: Request, res: Response) => {
    res.status(HttpStatusCode.Ok).json({
        status: MESSAGES.SERVER.HEALTH_STATUS,
        timestamp: new Date().toISOString(),
    });
});

export default app;