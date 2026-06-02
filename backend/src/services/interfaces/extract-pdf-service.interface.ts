export interface IExtractPdfService {
    extract(fileName: string, pages: []): Promise<Buffer>
}