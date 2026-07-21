import React, { useState } from 'react';
import { pdfjs } from 'react-pdf';
import { extract } from '../services/api.service';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { PdfPreview } from './PdfPreview';
import { PdfSidebar } from './PdfSidebar';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  file: File | null;
  fileId?: string | null;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ file, fileId }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedPdfUrl, setExtractedPdfUrl] = useState<string | null>(null);
  const [extractSuccess, setExtractSuccess] = useState<boolean>(false);
  const [_extractedPdfBlob, setExtractedPdfBlob] = useState<Blob | null>(null);
  const [viewingExtracted, setViewingExtracted] = useState<boolean>(false);
  const [outputFilename, setOutputFilename] = useState<string>(
    file ? file.name.replace(/\.pdf$/i, '') : 'extracted'
  );
  const [sortPages, setSortPages] = useState<boolean>(false);

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-theme-border rounded-xl bg-theme-card shadow-sm min-h-[500px] h-full">
        <p className="text-theme-text-sec font-medium">
          Upload a PDF to view it here
        </p>
      </div>
    );
  }

  const togglePageSelection = () => {
    setExtractSuccess(false);

    if (extractedPdfUrl) {
      URL.revokeObjectURL(extractedPdfUrl);
      setExtractedPdfUrl(null);
      setExtractedPdfBlob(null);
      setViewingExtracted(false);
    }

    setSelectedPages((prev) => {
      if (prev.includes(pageNumber)) {
        return prev.filter((p) => p !== pageNumber);
      }
      return [...prev, pageNumber];
    });
  };

  const removePage = (pageNum: number) => {
    setSelectedPages((prev) => prev.filter((p) => p !== pageNum));
  };

  const reorderPages = (pages: number[]) => {
    setSelectedPages(pages);
  };

  const isCurrentPageSelected = selectedPages.includes(pageNumber);

  const handleExtract = async () => {
    if (!file || !fileId || selectedPages.length === 0) return;

    try {
      setIsExtracting(true);
      setExtractSuccess(false);

      const pagesToExtract = sortPages
        ? [...selectedPages].sort((a, b) => a - b)
        : [...selectedPages];
      const pdfBlob = await extract(fileId, pagesToExtract, outputFilename);

      const url = URL.createObjectURL(pdfBlob);

      setExtractedPdfBlob(pdfBlob);
      setExtractedPdfUrl(url);
      setExtractSuccess(true);

      // Automatically switch to view the extracted PDF
      setViewingExtracted(true);
      setSelectedPages([]);

    } catch (error) {
      console.error("Failed to extract PDF pages:", error);
      alert("An error occurred while extracting the PDF pages.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDownload = () => {
    if (!extractedPdfUrl || !file) return;
    const link = document.createElement('a');
    link.href = extractedPdfUrl;
    link.download = `${outputFilename || 'extracted'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  let currentPreviewFile: File | string | null = file;
  if (viewingExtracted && extractedPdfUrl) {
    currentPreviewFile = extractedPdfUrl;
  }

  return (
    <div className="flex h-full w-full bg-theme-bg overflow-hidden relative border border-theme-border rounded-xl shadow-sm">
      {/* Main Preview Area */}
      <div className="flex-1 overflow-hidden h-full">
        <div className="h-full flex flex-col">
          {viewingExtracted && (
            <div className="bg-theme-primary/10 border-b border-theme-primary/30 p-2 flex items-center justify-between text-theme-primary text-sm font-medium">
              <span>Previewing Extracted PDF</span>
              <button
                onClick={() => setViewingExtracted(false)}
                className="hover:underline text-xs"
              >
                Back to Original
              </button>
            </div>
          )}
          <PdfPreview
            file={currentPreviewFile}
            pageNumber={pageNumber}
            numPages={numPages}
            scale={scale}
            isCurrentPageSelected={isCurrentPageSelected}
            onPageChange={setPageNumber}
            onNumPagesChange={setNumPages}
            onScaleChange={setScale}
            onToggleSelection={togglePageSelection}
            viewingExtracted={viewingExtracted}
          />
        </div>
      </div>

      {/* Sidebar Area */}
      <PdfSidebar
        file={file}
        selectedPages={selectedPages}
        onRemovePage={removePage}
        onReorder={reorderPages}
        onPageClick={(page) => setPageNumber(page)}
        onExtract={handleExtract}
        isExtracting={isExtracting}
        extractSuccess={extractSuccess}
        onDownload={handleDownload}
        extractedPdfUrl={extractedPdfUrl}
        outputFilename={outputFilename}
        onFilenameChange={setOutputFilename}
        sortPages={sortPages}
        onToggleSort={() => setSortPages((prev) => !prev)}
      />
    </div>
  );
};
