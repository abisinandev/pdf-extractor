export interface IPdfService {
    extractText(fileId: string): Promise<string>;
}
