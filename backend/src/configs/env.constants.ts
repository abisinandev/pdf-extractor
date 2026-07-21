import dotenv from "dotenv";
import { z } from "zod";
dotenv.config({ quiet: true });

const envSchema = z.object({
    PORT: z
        .string()
        .default("3000")
        .transform(Number)
        .refine((n) => !isNaN(n) && n > 0, { message: "PORT must be a positive number" }),
    UPLOAD_DIR: z.string().default("uploads"),
    SUPABASE_URL: z.string().url({ message: "SUPABASE_URL must be a valid URL" }),
    SUPABASE_SERVICE_ROLE_KEY: z
        .string()
        .min(1, { message: "SUPABASE_SERVICE_ROLE_KEY cannot be empty" }),
    SUPABASE_BUCKET_NAME: z
        .string()
        .min(1, { message: "SUPABASE_BUCKET_NAME cannot be empty" }),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("\n❌ Invalid or missing environment variables:");
    parsed.error.issues.forEach((issue) => {
        const field = issue.path.join(".") || "unknown";
        console.error(`   - ${field}: ${issue.message}`);
    });
    console.error("\n💡 Ensure these are set in your .env file and restart the server.\n");
    process.exit(1);
}

export const ENV = parsed.data;