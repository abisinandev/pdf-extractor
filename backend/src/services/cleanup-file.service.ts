import fs from "fs/promises";
import path from "path";
import { IUploadCleanupService } from "./interfaces/cleanup-upload-service.interface";

export class UploadCleanupService implements IUploadCleanupService {
    private readonly uploadDir: string;

    constructor() {
        this.uploadDir = path.join(process.cwd(), "uploads");
    }

    public async cleanupUploads(): Promise<void> {
        try {
            const files = await fs.readdir(this.uploadDir);

            for (const file of files) {
                const filePath = path.join(this.uploadDir, file);
                await fs.unlink(filePath);
            }

            console.log("Uploads cleaned successfully");
        } catch (error) {
            console.error("Cleanup failed:", error);
        }
    }
}