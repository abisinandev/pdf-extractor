export const PDF_ROUTES = {
    UPLOAD: "/upload",
    GET_PDF: "/pdf/:fileId",
    EXTRACT_PDF: "/pdf/:id/extract"
} as const;

export const COMMON_ROUTES = {
    HEALTH: "/health",
}