import React from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LandingPage } from "./pages/LandingPage";
import { PdfExtractorPage } from "./pages/PdfExtractorPage";
import { useAppContext } from "./context/AppContext";

const App: React.FC = () => {
  const { currentPage } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col bg-theme-bg text-theme-text font-sans text-sm transition-colors duration-200">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col h-full">
        {currentPage === 'home' ? (
          <LandingPage />
        ) : (
          <PdfExtractorPage />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;