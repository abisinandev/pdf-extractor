export const MESSAGES = {
    SERVER: {
        RUNNING: "Server is running on:",
        HEALTH_STATUS: "UP",
        INTERNAL_ERROR: "Internal Server Error",
    },
    DOC: {
        UPLOADED: "File uploaded successfully",
        FETCHED: "Data fetched successfully",
        NOT_FOUND: "Not found content",
        FILE_TYPE_NOT_ALLOWED: "File type is not allowed",
        CONTENT_TOO_LARGE: "File size exceeds the maximum limit of 10 MB.",
        REQUIRED: "Document file is required.",
        DOC_FILE_REQUIRED: "Document file is required.",
        FILE_IS_EMPTY: "Uploaded file is empty.",
    },
    STORAGE: {
        UPLOAD_FAILED: "Upload failed",
        NOT_FOUND: "Document not found in storage.",
        DELETE_FAILED: "Delete failed",
        CREATE_FAILED: "Failed to create document record",
    }
} as const;
