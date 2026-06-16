import path from 'path';

export const getFilePath = (fileId: string, uploadDir = "uploads") => {
    const filePath = path.join(
        process.cwd(),
        uploadDir,
        fileId,
    );
    return filePath;
}