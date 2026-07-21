import { NextFunction, Request, Response } from "express";
import { AppError } from "../configs/app.error";
import { HttpStatusCode } from "axios";
import { MESSAGES } from "../constants/messages.constants";

export const validateDocument = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
    if (!req.file) {
        return next(
            new AppError(
                HttpStatusCode.BadRequest,
                MESSAGES.DOC.DOC_FILE_REQUIRED
            )
        );
    }

    if (req.file.mimetype !== "application/pdf") {
        return next(
            new AppError(
                HttpStatusCode.BadRequest,
                MESSAGES.DOC.FILE_TYPE_NOT_ALLOWED,
            )
        );
    }

    if (req.file.size === 0) {
        return next(
            new AppError(
                HttpStatusCode.BadRequest,
                MESSAGES.DOC.FILE_IS_EMPTY
            )
        );
    }

    next();
};