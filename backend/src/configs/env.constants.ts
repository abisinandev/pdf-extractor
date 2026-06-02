import dotenv from "dotenv";
dotenv.config({ quiet: true });

export const ENV = {
    PORT: Number(process.env.PORT) || 3000,
    UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",
} as const;
export type EnvType = typeof ENV;