import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Loader2, Maximize2, Minimize2, CheckSquare, Square, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  file: File | null;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ file }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedPdfUrl, setExtractedPdfUrl] = useState<string | null>(null);
  const [extractSuccess, setExtractSuccess] = useState<boolean>(false);

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-slate-200 rounded-xl bg-white shadow-sm min-h-[500px] h-full">
        <p className="text-slate-500 font-medium">
          Upload a PDF to view it here
        </p>
      </div>
    );
  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setSelectedPages(new Set());
  };

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) =>
      Math.min(Math.max(1, prevPageNumber + offset), numPages)
    );
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const togglePageSelection = () => {
    setExtractSuccess(false);
    if (extractedPdfUrl) {
      URL.revokeObjectURL(extractedPdfUrl);
      setExtractedPdfUrl(null);
    }
    
    setSelectedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageNumber)) {
        newSet.delete(pageNumber);
      } else {
        newSet.add(pageNumber);
      }
      return newSet;
    });
  };

  const isCurrentPageSelected = selectedPages.has(pageNumber);

  const handleExtract = async () => {
    if (!file || selectedPages.size === 0) return;

    try {
      setIsExtracting(true);
      setExtractSuccess(false);

      const arrayBuffer = await file.arrayBuffer();

      const originalPdf = await PDFDocument.load(arrayBuffer);

      const newPdf = await PDFDocument.create();

      const pagesToCopy = Array.from(selectedPages).sort((a, b) => a - b).map(p => p - 1);
      const copiedPages = await newPdf.copyPages(originalPdf, pagesToCopy);

      copiedPages.forEach(page => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();

      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setExtractedPdfUrl(url);
      setExtractSuccess(true);

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
    link.download = `extracted_${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden w-full relative">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b border-slate-200 bg-white shadow-sm shrink-0 gap-3">
        {/* Navigation & Selection */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg p-1 border border-slate-200">
            <button
              onClick={previousPage}
              disabled={pageNumber <= 1}
              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>

            <span className="text-xs font-semibold text-slate-700 min-w-[70px] text-center">
              {pageNumber} / {numPages || '-'}
            </span>

            <button
              onClick={nextPage}
              disabled={pageNumber >= numPages}
              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>

          <button
            onClick={togglePageSelection}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${isCurrentPageSelected
              ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
          >
            {isCurrentPageSelected ? (
              <><CheckSquare className="w-4 h-4" /> Selected</>
            ) : (
              <><Square className="w-4 h-4" /> Select Page</>
            )}
          </button>
        </div>

        {/* Action & Zoom */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg p-1 border border-slate-200">
            <button
              onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all"
              title="Zoom Out"
            >
              <Minimize2 className="w-4 h-4 text-slate-700" />
            </button>
            <span className="text-xs font-semibold text-slate-600 w-10 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale(s => Math.min(3.0, s + 0.2))}
              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all"
              title="Zoom In"
            >
              <Maximize2 className="w-4 h-4 text-slate-700" />
            </button>
          </div>

          {selectedPages.size > 0 && !extractSuccess && (
            <button
              onClick={handleExtract}
              disabled={isExtracting}
              className="flex items-center gap-2 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-70 shadow-sm"
            >
              {isExtracting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckSquare className="w-4 h-4" />
              )}
              Extract {selectedPages.size} {selectedPages.size === 1 ? 'Page' : 'Pages'}
            </button>
          )}

          {extractSuccess && extractedPdfUrl && (
            <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
              <span className="text-green-600 text-sm font-medium flex items-center gap-1.5 px-2">
                <CheckSquare className="w-4 h-4" /> Extracted successfully!
              </span>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Viewer Area */}
      <div className="flex-1 overflow-auto bg-slate-100/50 p-2 sm:p-4 flex justify-center w-full relative">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center justify-center h-64 w-full">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
              <p className="mt-3 text-sm font-medium text-slate-600">Loading document...</p>
            </div>
          }
          error={
            <div className="text-red-600 bg-red-50 p-4 rounded-lg text-sm font-medium border border-red-200 shadow-sm">
              Failed to load PDF file.
            </div>
          }
          className="pdf-document"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className={`rounded shadow-md bg-white border-2 transition-colors duration-200 ${isCurrentPageSelected ? 'border-red-500 ring-4 ring-red-500/10' : 'border-transparent'
              }`}
            loading={
              <div className="flex items-center justify-center h-64 w-full">
                <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
              </div>
            }
          />
        </Document>
      </div>
    </div>
  );
};
