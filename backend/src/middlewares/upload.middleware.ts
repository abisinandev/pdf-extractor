import { HttpStatusCode } from 'axios';
import multer from 'multer';
import path from 'path';
import { AppError } from '../configs/app.error';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), "uploads");
console.log("Directory: ", process.cwd());

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination(_req, _file, callback) {
        callback(null, 'uploads');
    },
    filename(_req, file, callback) {
        const unique = `${Date.now()}-${file.originalname}`
        callback(null, unique);
    },
});

export const upload = multer({
    storage,
    fileFilter: (_req, file, callback) => {
        const isPdf =
            (path.extname(file.originalname).toLowerCase() === '.pdf') && file.mimetype === "application/pdf";

        if (!isPdf) {
            return callback(new AppError(
                HttpStatusCode.BadRequest,
                "Only PDF files are allowed",
            ));
        }
        callback(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024,// 10MB
    }
})

