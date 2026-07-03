import cron from "node-cron";
import { IUploadCleanupService } from "../services/interfaces/cleanup-upload-service.interface";

export const cleaupFilesCron = (cleanupService: IUploadCleanupService) => {
    cron.schedule(
        "0 * * * *",
        async () => {
            console.log("Running upload cleanup...");
            await cleanupService.cleanupUploads();
        });
}