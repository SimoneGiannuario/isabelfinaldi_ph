import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { usePhotoProtection } from "./hooks/usePortfolio";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
import GalleryPage from "./pages/GalleryPage/GalleryPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import "./App.css";

// Activates all photo protection globally (right-click, drag, PrintScreen, print)
function PhotoProtection() {
  usePhotoProtection();
  return null;
}

function App() {
  return (
    <LanguageProvider>
      <PhotoProtection />
      <BrowserRouter basename="/isabelfinaldi_ph">
        <Routes>
          {/* Admin — no public Navbar / Footer */}
          <Route path="/admin" element={<AdminPage />} />

          {/* Public site */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                  </Routes>
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

