import "dotenv/config";
import app from "./app";
import { ENV } from "./configs/env.constants";
import { MESSAGES } from "./constants/messages.constants";
import { UploadCleanupService } from "./services/cleanup-file.service";
import { SupabaseStorageProvider } from "./provider/storage.provider";
import { cleanupFilesCron } from "./utils/cleanup-scheduler";

(() => {
    const storageProvider = new SupabaseStorageProvider();
    const cleanupSerice = new UploadCleanupService(storageProvider);
    cleanupFilesCron(cleanupSerice);
})();

app.listen(ENV.PORT, () => {
    console.log(`${MESSAGES.SERVER.RUNNING} ${ENV.PORT}`);
});