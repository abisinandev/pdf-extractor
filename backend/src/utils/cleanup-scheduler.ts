import cron from "node-cron";
import { IUploadCleanupService } from "../services/interfaces/cleanup-upload-service.interface";

/**
 * Responsible for running cron job scheduler on every 1-hours
 * @param cleanupService 
 * @returns 
 */
export const cleanupFilesCron = (
  cleanupService: IUploadCleanupService
) => {
  return cron.schedule("0 * * * *", async () => {
    console.log("Running upload cleanup...");
    await cleanupService.cleanupUploads();
  });
};