import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-theme-border bg-theme-surface py-4 mt-auto shrink-0">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-theme-primary font-hand font-bold text-2xl">
            DocuFy
          </span>
          <span className="text-theme-text-mut text-xs">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-theme-text-sec">
          <a href="#" className="hover:text-theme-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-theme-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-theme-primary transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};
