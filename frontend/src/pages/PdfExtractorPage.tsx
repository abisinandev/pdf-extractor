import React from "react";
import { UploadZone } from "../components/UploadZone";
import { PdfViewer } from "../components/PdfViewer";
import { ArrowLeft } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export const PdfExtractorPage: React.FC = () => {
  const { 
    setCurrentPage, 
    activeFile, 
    setActiveFile, 
    activeFileId, 
    setActiveFileId 
  } = useAppContext();

  const handleUploadSuccess = (fileId: string, file: File) => {
    setActiveFileId(fileId);
    setActiveFile(file);
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-5xl mx-auto px-4 py-8 h-full">
      
      <div className="flex items-center mb-6">
        <button 
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 text-theme-text-sec hover:text-theme-primary transition-colors text-sm font-medium mr-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>

      {!activeFile ? (
        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-2xl mx-auto mt-4">
          <h1 className="text-3xl font-extrabold text-theme-text tracking-tight mb-3 flex items-center gap-2 text-center">
            View & Select PDF Pages 
          </h1>
          <p className="text-theme-text-mut text-center mb-8">
            Upload your PDF document to preview it page by page and select content.
          </p>
          <div className="w-full">
            <UploadZone onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 h-[calc(100vh-12rem)] w-full relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-theme-text truncate pr-4">
              {activeFile.name}
            </h2>
            <button 
              onClick={() => { setActiveFile(null); setActiveFileId(null); }}
              className="px-4 py-1.5 bg-theme-surface hover:bg-theme-card border border-theme-border text-theme-text-sec rounded-lg text-xs font-medium transition-colors shrink-0"
            >
              Upload Another
            </button>
          </div>
          
          <div className="flex-1 w-full bg-theme-card border border-theme-border rounded-xl shadow-sm overflow-hidden h-full">
            <PdfViewer file={activeFile} fileId={activeFileId} />
          </div>
        </div>
      )}
    </div>
  );
};
