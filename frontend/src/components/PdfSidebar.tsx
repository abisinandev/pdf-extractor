import React from 'react';
import { Document, Page } from 'react-pdf';
import { Loader2, Trash2, CheckSquare, Download } from 'lucide-react';
import type { PdfSidebarProps } from './types/pdf.types';



export const PdfSidebar: React.FC<PdfSidebarProps> = ({
  file,
  selectedPages,
  onRemovePage,
  onReorder,
  onPageClick,
  onExtract,
  isExtracting,
  extractSuccess,
  onDownload,
  extractedPdfUrl,
  outputFilename,
  onFilenameChange,
  sortPages,
  onToggleSort,
}) => {
  const [draggedIdx, setDraggedIdx] = React.useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedIdx(null);
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIdx) return;

    const newPages = [...selectedPages];
    const draggedPage = newPages[draggedIdx];
    newPages.splice(draggedIdx, 1);
    newPages.splice(dropIdx, 0, draggedPage);

    onReorder(newPages);
    setDraggedIdx(null);
  };
  return (
    <div className="w-64 sm:w-72 border-l border-theme-border bg-theme-surface flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-theme-border flex items-center justify-between">
        <h3 className="font-semibold text-theme-text flex items-center gap-2">
          Selected Pages
        </h3>
        <span className="text-xs font-medium px-2 py-0.5 bg-theme-primary/10 text-theme-primary rounded-full">
          {selectedPages.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 gap-4 flex flex-col">
        {selectedPages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-sm text-theme-text-mut">No pages selected yet.</p>
            <p className="text-xs text-theme-text-sec mt-1">Select pages from the preview to add them here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {selectedPages.map((pageNum, idx) => (
              <div
                key={`${pageNum}-${idx}`}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                className={`relative group border border-theme-border rounded-lg overflow-hidden bg-theme-bg shadow-sm hover:border-theme-primary transition-colors cursor-pointer ${draggedIdx === idx ? 'opacity-50 ring-2 ring-theme-primary ring-offset-1' : ''
                  }`}
                onClick={() => onPageClick(pageNum)}
              >
                <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemovePage(pageNum);
                    }}
                    className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm transition-colors"
                    title="Remove page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="absolute top-1 left-1 z-10">
                  <div className="px-1.5 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded shadow-sm backdrop-blur-sm">
                    {pageNum}
                  </div>
                </div>
                <div className="w-full flex items-center justify-center p-2 bg-theme-card/50 pointer-events-none">
                  {file && (
                    <Document
                      key={pageNum}
                      file={file}
                      className="overflow-hidden rounded pointer-events-none"
                      onLoadError={() => { /* silent – thumbnail just won't appear */ }}
                    >
                      <Page
                        pageNumber={pageNum}
                        width={180}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        loading={
                          <div className="h-40 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-theme-text-mut animate-spin" />
                          </div>
                        }
                        error={
                          <div className="h-40 flex items-center justify-center text-xs text-theme-text-mut">
                            Page {pageNum}
                          </div>
                        }
                      />
                    </Document>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-theme-border bg-theme-card mt-auto flex flex-col gap-3">

        {/* Sort order toggle */}
        <button
          onClick={onToggleSort}
          className="flex items-center justify-between w-full px-3 py-2 rounded-lg border border-theme-border bg-theme-bg hover:bg-theme-primary/5 transition-colors group"
        >
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium text-theme-text">Sort by page number</span>
            <span className="text-[10px] text-theme-text-mut">
              {sortPages ? 'Extracting in ascending order' : 'Extracting in selection order'}
            </span>
          </div>
          {/* Toggle pill */}
          <div
            className={`relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ${sortPages ? 'bg-theme-primary' : 'bg-theme-border'
              }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${sortPages ? 'translate-x-4' : 'translate-x-0'
                }`}
            />
          </div>
        </button>

        {/* Filename input */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-theme-text-sec">Output filename</label>
          <div className="flex items-center border border-theme-border rounded-lg overflow-hidden bg-theme-bg focus-within:border-theme-primary transition-colors">
            <input
              type="text"
              value={outputFilename}
              onChange={(e) => onFilenameChange(e.target.value)}
              placeholder="extracted"
              className="flex-1 px-3 py-1.5 text-sm bg-transparent text-theme-text outline-none placeholder:text-theme-text-mut"
            />
            <span className="pr-3 text-xs text-theme-text-mut select-none">.pdf</span>
          </div>
        </div>

        <button
          onClick={onExtract}
          disabled={selectedPages.length === 0 || isExtracting}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-theme-primary hover:bg-theme-primary-hover text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isExtracting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckSquare className="w-4 h-4" />
          )}
          Extract {selectedPages.length} {selectedPages.length === 1 ? 'Page' : 'Pages'}
        </button>

        {extractSuccess && extractedPdfUrl && (
          <button
            onClick={onDownload}
            className="flex items-center justify-center gap-2 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm animate-in fade-in"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        )}
      </div>
    </div>
  );
};
