import { createContext, useContext, useState } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("it"); // Italian by default

  const t = translations[lang];
  const toggle = () => setLang((l) => (l === "it" ? "en" : "it"));

  return (
    <LanguageContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook for easy consumption
export function useLang() {
  return useContext(LanguageContext);
}
