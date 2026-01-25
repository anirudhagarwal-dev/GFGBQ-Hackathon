"use client";

import { useState, useEffect } from "react";
import { type Language, getLanguageFromStorage, getTranslation } from "@/lib/languages";

export function useLanguage() {
  const [lang, setLang] = useState<Language>(() => getLanguageFromStorage());

  useEffect(() => {
    const handleLanguageChange = (e: Event) => {
      const detail = (e as CustomEvent<Language>).detail;
      if (detail) setLang(detail);
    };
    
    window.addEventListener("languagechange", handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener("languagechange", handleLanguageChange as EventListener);
    };
  }, []);

  const t = (key: string): string => {
    return getTranslation(key, lang);
  };

  return { lang, t };
}

