import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Critical fonts — loaded immediately for first paint
import "@fontsource/inter/400.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/400-italic.css";

// Non-critical font weights — lazy-loaded after first render
const loadNonCriticalFonts = () => {
  void import("@fontsource/inter/300.css");
  void import("@fontsource/inter/500.css");
  void import("@fontsource/inter/600.css");
  void import("@fontsource/playfair-display/500.css");
  void import("@fontsource/playfair-display/600.css");
  void import("@fontsource/playfair-display/700.css");
};

if (typeof window !== "undefined" && "requestIdleCallback" in window) {
  window.requestIdleCallback(loadNonCriticalFonts);
} else {
  window.setTimeout(loadNonCriticalFonts, 0);
}

import "./index.css";
import App from "./App";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
      <SpeedInsights />
    </HelmetProvider>
  </StrictMode>
);
