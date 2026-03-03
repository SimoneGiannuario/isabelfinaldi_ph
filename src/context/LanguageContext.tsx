import { createContext, useContext, useState, type ReactNode } from "react";
import { translations } from "../i18n/translations";
import type { TranslationSet, Lang } from "../types/translations";

interface LanguageContextValue {
  lang: Lang;
  t: TranslationSet;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("it"); // Italian by default

  const t = translations[lang];
  const toggle = () => setLang((l) => (l === "it" ? "en" : "it"));

  return (
    <LanguageContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook for easy consumption
export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
}
