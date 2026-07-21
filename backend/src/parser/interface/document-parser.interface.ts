export interface IDocumentParser {
    extractText(buffer: Buffer): Promise<string>;
    extract(buffer: Buffer, pages: []): Promise<Buffer>;
}