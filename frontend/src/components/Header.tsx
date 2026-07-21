import React from "react";
import { Moon, Sun } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode, setCurrentPage } = useAppContext();
  return (
    <header className="sticky top-0 z-10 w-full border-b border-theme-border bg-theme-surface shadow-sm transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <div className="flex items-center text-4xl tracking-tight">
            <span className="text-theme-primary font-hand font-bold">
              DocuFy
            </span>
          </div>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-theme-bg hover:bg-theme-card border border-theme-border text-theme-text-sec transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};
