import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import type { PdfPreviewProps } from './types/pdf.types';


export const PdfPreview: React.FC<PdfPreviewProps> = ({
  file,
  pageNumber,
  numPages,
  scale,
  isCurrentPageSelected,
  onPageChange,
  onNumPagesChange,
  onScaleChange,
  onToggleSelection,
  viewingExtracted,
}) => {
  const [inputValue, setInputValue] = useState<string>(String(pageNumber));

  const fileKey = file instanceof File ? file.name + file.size : (file ?? 'none');

  React.useEffect(() => {
    onPageChange(1);
    setInputValue('1');
  }, [fileKey]);

  React.useEffect(() => {
    setInputValue(String(pageNumber));
  }, [pageNumber]);

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    onNumPagesChange(numPages);
  };

  const commitPageInput = () => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= numPages) {
      onPageChange(parsed);
    } else {
      setInputValue(String(pageNumber));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitPageInput();
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setInputValue(String(pageNumber));
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-theme-border bg-theme-card shrink-0">

        {/* Page navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            className="px-2 py-1 rounded text-sm bg-theme-bg border border-theme-border hover:bg-theme-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            ‹
          </button>

          <div className="flex items-center gap-1 text-sm text-theme-text-sec">
            <input
              type="number"
              min={1}
              max={numPages || 1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={commitPageInput}
              onKeyDown={handleKeyDown}
              className="w-10 text-center rounded border border-theme-border bg-theme-bg text-theme-text text-sm py-0.5 outline-none focus:border-theme-primary transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span>of <span className="font-semibold text-theme-text">{numPages || '—'}</span></span>
          </div>

          <button
            onClick={() => onPageChange(Math.min(numPages, pageNumber + 1))}
            disabled={pageNumber >= numPages}
            className="px-2 py-1 rounded text-sm bg-theme-bg border border-theme-border hover:bg-theme-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            ›
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onScaleChange(Math.max(0.5, scale - 0.1))}
            className="px-2 py-1 rounded text-sm bg-theme-bg border border-theme-border hover:bg-theme-primary/10 transition"
          >
            −
          </button>
          <span className="text-sm w-14 text-center text-theme-text-sec">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => onScaleChange(Math.min(3, scale + 0.1))}
            className="px-2 py-1 rounded text-sm bg-theme-bg border border-theme-border hover:bg-theme-primary/10 transition"
          >
            +
          </button>
        </div>

        {/* Select page button */}
        {!viewingExtracted && (
          <button
            onClick={onToggleSelection}
            className={`px-3 py-1 rounded text-sm font-medium border transition ${isCurrentPageSelected
                ? 'bg-theme-primary text-white border-theme-primary'
                : 'bg-theme-bg border-theme-border text-theme-text-sec hover:bg-theme-primary/10'
              }`}
          >
            {isCurrentPageSelected ? '✓ Selected' : 'Select Page'}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto flex justify-center p-4 bg-theme-bg">
        {file ? (
          <Document
            key={fileKey}
            file={file}
            onLoadSuccess={handleDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-full text-theme-text-sec text-sm">
                Loading PDF…
              </div>
            }
            error={
              <div className="flex items-center justify-center h-full text-red-500 text-sm">
                Failed to load PDF.
              </div>
            }
          >
            <div
              onClick={viewingExtracted ? undefined : onToggleSelection}
              title={viewingExtracted ? undefined : (isCurrentPageSelected ? 'Click to deselect page' : 'Click to select page')}
              className={`relative rounded-sm transition-all duration-150 ${viewingExtracted
                  ? ''
                  : 'cursor-pointer ' + (isCurrentPageSelected
                    ? 'ring-4 ring-theme-primary ring-offset-2 ring-offset-theme-bg'
                    : 'ring-2 ring-transparent hover:ring-theme-primary/40 ring-offset-2 ring-offset-theme-bg')
                }`}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderAnnotationLayer
                renderTextLayer
              />
              {/* Selection badge overlay */}
              {!viewingExtracted && isCurrentPageSelected && (
                <div className="absolute top-2 right-2 bg-theme-primary text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md pointer-events-none">
                  ✓ Selected
                </div>
              )}
            </div>
          </Document>
        ) : (
          <div className="flex items-center justify-center h-full text-theme-text-sec text-sm">
            No file selected.
          </div>
        )}
      </div>
    </div>
  );
};
