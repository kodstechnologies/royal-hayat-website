import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { en, type TranslationKey } from "@/i18n/en";

type Language = "en" | "ar";
type Dict = Record<string, string>;

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
  dir: "ltr",
});

let arDictCache: Dict | null = null;
let arLoadPromise: Promise<Dict> | null = null;

function loadArDict(): Promise<Dict> {
  if (arDictCache) return Promise.resolve(arDictCache);
  if (!arLoadPromise) {
    arLoadPromise = import("@/i18n/ar").then((mod) => {
      arDictCache = mod.ar as Dict;
      return arDictCache;
    });
  }
  return arLoadPromise;
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>("en");
  const [arDict, setArDict] = useState<Dict | null>(null);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    if (next === "ar") {
      void loadArDict().then(setArDict);
    }
  }, []);

  const activeDict = lang === "ar" ? arDict ?? en : en;

  const t = useCallback(
    (key: string) => activeDict[key] ?? en[key as TranslationKey] ?? key,
    [activeDict],
  );

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);
  }, [lang, dir]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      <div dir={dir}>{children}</div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
