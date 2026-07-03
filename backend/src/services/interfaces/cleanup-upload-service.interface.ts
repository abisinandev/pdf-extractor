export interface IUploadCleanupService {
  cleanupUploads(): Promise<void>;
}