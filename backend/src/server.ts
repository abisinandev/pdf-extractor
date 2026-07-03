import "dotenv/config";
import app from "./app";
import { ENV } from "./configs/env.constants";
import { MESSAGES } from "./configs/messages.constants";
import { UploadCleanupService } from "./services/cleanup-file.service";
import { cleanupFilesCron } from "./utils/cleanup-scheduler";

(() => {
    const cleanupSerice = new UploadCleanupService();
    cleanupFilesCron(cleanupSerice);
})();

app.listen(ENV.PORT, () => {
    console.log(`${MESSAGES.SERVER.RUNNING} ${ENV.PORT}`);
});