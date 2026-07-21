import { IUploadCleanupService } from "./interfaces/cleanup-upload-service.interface";
import { IStorageProvider } from "../provider/interface/storage-provider.interface";

/**
 * Cleanup service
 * - Responsible for when running jobs, 
 *  it will remove the previous add documents from supbase
 */
export class UploadCleanupService implements IUploadCleanupService {
    constructor(private readonly storageProvider: IStorageProvider) {}

    public async cleanupUploads(): Promise<void> {
        try {
            await this.storageProvider.deleteAll();
            console.log("Supabase cleanup completed successfully");
        } catch (error) {
            console.error("Supabase cleanup failed:", error);
        }
    }
}