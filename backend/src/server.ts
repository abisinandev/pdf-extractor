import "dotenv/config";
import app from "./app";
import { ENV } from "./configs/env.constants";
import { MESSAGES } from "./configs/messages.constants";

app.listen(ENV.PORT, () => {
    console.log(`${MESSAGES.SERVER.RUNNING} ${ENV.PORT}`);
});