export interface PdfPreviewProps {
    file: File | string | null;
    pageNumber: number;
    numPages: number;
    scale: number;
    isCurrentPageSelected: boolean;
    onPageChange: (page: number) => void;
    onNumPagesChange: (numPages: number) => void;
    onScaleChange: (scale: number) => void;
    onToggleSelection: () => void;
    viewingExtracted?: boolean;
}


export interface PdfSidebarProps {
    file: File | null;
    selectedPages: number[];
    onRemovePage: (pageNumber: number) => void;
    onReorder: (pages: number[]) => void;
    onPageClick: (pageNumber: number) => void;
    onExtract: () => void;
    isExtracting: boolean;
    extractSuccess: boolean;
    onDownload: () => void;
    extractedPdfUrl: string | null;
    outputFilename: string;
    onFilenameChange: (name: string) => void;
    sortPages: boolean;
    onToggleSort: () => void;
}