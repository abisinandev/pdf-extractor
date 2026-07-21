import { HttpStatusCode } from 'axios';
import multer from 'multer';
import { AppError } from '../configs/app.error';
import { allowedMimeTypes } from '../constants/mime.type';
import { MESSAGES } from '../constants/messages.constants';

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    fileFilter: (_req, file, callback) => {
        const isAllowed = allowedMimeTypes.includes(file.mimetype);

        if (!isAllowed) {
            return callback(
                new AppError(
                    HttpStatusCode.BadRequest,
                    MESSAGES.DOC.FILE_TYPE_NOT_ALLOWED,
                )
            );
        }

        callback(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024,// 10MB
    }
})

