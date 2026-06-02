import React, { useState } from "react";
import { UploadZone } from "./components/UploadZone";
import { PdfViewer } from "./components/PdfViewer";

const App: React.FC = () => {
  const [activeFile, setActiveFile] = useState<File | null>(null);

  const handleUploadSuccess = (_fileId: string, file: File) => {
    setActiveFile(file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans text-sm">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center text-lg font-bold tracking-tight">
              <span className="bg-red-600 text-white px-2 py-0.5 rounded shadow-sm mr-1.5">
                PDF
              </span>
              <span className="text-black">
                Extractor
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 flex flex-col h-full">
        {!activeFile ? (
          <div className="flex flex-col items-center justify-center flex-1 w-full max-w-2xl mx-auto mt-12">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-3 flex items-center gap-2 text-center">
              View & Select PDF Pages 
            </h1>
            <p className="text-slate-500 text-center mb-8">
              Upload your PDF document to preview it page by page and select content.
            </p>
            <div className="w-full">
              <UploadZone onUploadSuccess={handleUploadSuccess} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 h-[calc(100vh-8rem)] w-full relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-800 truncate pr-4">
                {activeFile.name}
              </h2>
              <button 
                onClick={() => setActiveFile(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors shrink-0"
              >
                Upload Another
              </button>
            </div>
            
            <div className="flex-1 w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-full">
              <PdfViewer file={activeFile} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;