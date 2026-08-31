'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { type Language, LANGUAGES, t, type TranslationKey } from '@/lib/translations';
import { Languages } from 'lucide-react';

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: TranslationKey) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
  dir: 'ltr',
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('grocery-lang') as Language | null;
    if (saved && ['en', 'sd', 'ur'].includes(saved)) {
      setLangState(saved);
    }
    setMounted(true);
  }, []);

  // Update html attributes when lang changes
  useEffect(() => {
    if (!mounted) return;
    const found = LANGUAGES.find((l) => l.code === lang);
    const dir = found?.dir ?? 'ltr';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('grocery-lang', lang);
  }, [lang, mounted]);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
  }, []);

  const translate = useCallback(
    (key: TranslationKey) => t(lang, key),
    [lang]
  );

  const found = LANGUAGES.find((l) => l.code === lang);
  const dir = found?.dir ?? 'ltr';

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translate, dir }}>
      {children}
      {mounted && <FloatingLanguageButton />}
    </LanguageContext.Provider>
  );
}

export function FloatingLanguageButton() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[49]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      {open && (
        <div
          className="fixed right-0 top-1/2 z-[51] mr-1 -translate-y-1/2 flex flex-col gap-1 rounded-2xl border border-violet-200 bg-white p-2 shadow-2xl"
          style={{ marginTop: '60px' }}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                lang === l.code
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-violet-50 hover:text-violet-700'
              }`}
              dir={l.dir}
            >
              <span className="text-sm">{l.nativeLabel}</span>
              {lang === l.code && (
                <span className="ml-1 h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Floating Trigger Button — below A11y button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed right-0 top-1/2 z-50 flex translate-y-8 items-center gap-2 rounded-l-2xl border-y border-l border-violet-200 bg-violet-600 px-3.5 py-3 text-white shadow-2xl backdrop-blur-md active:scale-95 transition-all hover:bg-violet-700 hover:px-4"
        style={{ marginTop: '72px' }}
        aria-label={`Language: ${current.label}. Click to change language.`}
        title="Change Language"
      >
        <div className="flex items-center gap-1.5 font-bold">
          <Languages size={20} className="text-violet-200" />
          <div className="flex flex-col items-start leading-none text-left">
            <span className="text-[10px] uppercase tracking-wider text-violet-200 font-extrabold">
              Lang
            </span>
            <span className="text-xs font-black tracking-tight">{current.nativeLabel}</span>
          </div>
        </div>
      </button>
    </>
  );
}
