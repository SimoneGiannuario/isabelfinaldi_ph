import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { usePhotoProtection } from "./hooks/usePortfolio";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
import "./App.css";

// Lazy-loaded routes — only downloaded when navigated to
const GalleryPage = lazy(() => import("./pages/GalleryPage/GalleryPage"));
const AdminPage = lazy(() => import("./pages/AdminPage/AdminPage"));

// Activates all photo protection globally (right-click, drag, PrintScreen, print)
function PhotoProtection() {
  usePhotoProtection();
  return null;
}

// Minimal loading fallback
function PageLoader() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "50vh",
      color: "var(--color-text-muted)",
      fontFamily: "var(--font-body)",
    }}>
      Caricamento…
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <PhotoProtection />
      <BrowserRouter basename="/isabelfinaldi_ph">
        {/* Skip navigation — first focusable element */}
        <a href="#main-content" className="skip-nav">
          Vai al contenuto principale
        </a>

        <Routes>
          {/* Admin — no public Navbar / Footer */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<PageLoader />}>
                <AdminPage />
              </Suspense>
            }
          />

          {/* Public site */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <main id="main-content">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/gallery" element={<GalleryPage />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
