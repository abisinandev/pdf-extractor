import React, { useRef } from "react";
import { FileText, FileSpreadsheet, FileIcon, Lock, ChevronLeft, ChevronRight, UploadCloud } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export const LandingPage: React.FC = () => {
  const { setCurrentPage } = useAppContext();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 300;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const tools = [
    {
      id: 'pdf',
      name: 'PDF Extractor',
      icon: <FileText className="w-10 h-10 text-theme-primary" />,
      active: true,
    },
    {
      id: 'excel',
      name: 'Excel Viewer',
      icon: <FileSpreadsheet className="w-10 h-10 text-green-500" />,
      active: false,
    },
    {
      id: 'word',
      name: 'Word Editor',
      icon: <FileIcon className="w-10 h-10 text-blue-500" />,
      active: false,
    },
    {
      id: 'docs',
      name: 'Docs Viewer',
      icon: <FileText className="w-10 h-10 text-orange-500" />,
      active: false,
    },
    {
      id: 'images',
      name: 'Image Converter',
      icon: <FileIcon className="w-10 h-10 text-pink-500" />,
      active: false,
    }
  ];

  return (
    <div className="flex flex-col w-full flex-1">
      {/* Hero Section */}
      <section className="w-full bg-theme-surface relative overflow-hidden flex-shrink-0">
        {/* Subtle wavy background pattern using SVG */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180 -mb-[1px]">
          <svg className="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-theme-bg drop-shadow-[0_-2px_4px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_-2px_4px_rgba(0,0,0,0.2)]"></path>
          </svg>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 max-w-lg text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-theme-text tracking-tight mb-6 leading-tight">
              Upload, Select and Extract your <span className="text-theme-primary">Docs</span>
            </h1>
            <p className="text-lg text-theme-text-sec mb-8">
              Your all-in-one document workspace. Effortlessly manage PDFs, Excel files, Images and more securely in your browser.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col items-center">
            <button
              onClick={() => setCurrentPage('pdf')}
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-theme-primary hover:bg-theme-primary-hover text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:shadow-xl hover:-translate-y-1 border border-theme-primary/50"
            >
              <UploadCloud className="w-6 h-6" />
              Pick your files
            </button>
            <p className="text-xs text-theme-text-mut text-center mt-4">
              Redirects to PDF Extractor (Currently active)
            </p>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="w-full bg-theme-bg py-16 md:py-24 flex-1">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-theme-text">Our Tools</h2>
            <div className="flex gap-3">
              <button onClick={() => scroll('left')} className="p-3 rounded-full border border-theme-border bg-theme-card hover:bg-theme-surface text-theme-text-sec transition-colors shadow-sm">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scroll('right')} className="p-3 rounded-full border border-theme-border bg-theme-card hover:bg-theme-surface text-theme-text-sec transition-colors shadow-sm">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 px-2 -mx-2 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => tool.active && setCurrentPage('pdf')}
                className={`snap-start shrink-0 w-64 md:w-72 group relative flex flex-col items-center text-center p-8 bg-theme-card border-2 rounded-2xl transition-all duration-300
                  ${tool.active
                    ? 'border-theme-border hover:border-theme-primary cursor-pointer hover:shadow-xl hover:-translate-y-2'
                    : 'border-theme-border opacity-60 cursor-not-allowed'
                  }`}
              >
                {!tool.active && (
                  <div className="absolute top-4 right-4 bg-theme-surface text-theme-text-sec text-xs font-bold px-3 py-1 rounded-full border border-theme-border flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> Coming Soon
                  </div>
                )}

                <div className={`p-5 rounded-full mb-6 transition-transform duration-300 shadow-sm border border-theme-border/50 ${tool.active ? 'bg-theme-primary/10 group-hover:scale-110' : 'bg-theme-surface grayscale'}`}>
                  {tool.icon}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${tool.active ? 'text-theme-text' : 'text-theme-text-mut'}`}>
                  {tool.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
