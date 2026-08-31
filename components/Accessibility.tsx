'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { ZoomIn } from 'lucide-react';

type FontSize = 'normal' | 'large' | 'xlarge';

interface A11yContextValue {
  fontSize: FontSize;
  cycleFontSize: () => void;
  isLarge: boolean;
}

const A11yContext = createContext<A11yContextValue>({
  fontSize: 'normal',
  cycleFontSize: () => {},
  isLarge: false,
});

export const useA11y = () => useContext(A11yContext);

export function A11yProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>('normal');

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('grocery-font-size') as FontSize | null;
    if (saved && ['normal', 'large', 'xlarge'].includes(saved)) {
      setFontSize(saved);
    }
  }, []);

  // Apply to <html>
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute(
      'data-font-size',
      fontSize === 'normal' ? 'normal' : fontSize
    );
    localStorage.setItem('grocery-font-size', fontSize);
  }, [fontSize]);

  const cycleFontSize = useCallback(() => {
    setFontSize((prev) => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'xlarge';
      return 'normal';
    });
  }, []);

  return (
    <A11yContext.Provider
      value={{ fontSize, cycleFontSize, isLarge: fontSize !== 'normal' }}
    >
      {children}
      <FloatingA11yButton />
    </A11yContext.Provider>
  );
}

// Prominent floating button sticking to right side center of screen across all pages
export function FloatingA11yButton() {
  const { fontSize, cycleFontSize } = useA11y();

  const labels: Record<FontSize, string> = {
    normal: 'Text: 100%',
    large: 'Text: 115%',
    xlarge: 'Text: 135%',
  };

  const badgeText: Record<FontSize, string> = {
    normal: '1x',
    large: '1.2x',
    xlarge: '1.4x',
  };

  return (
    <button
      onClick={cycleFontSize}
      className="fixed right-0 top-1/2 z-50 flex -translate-y-1/2 items-center gap-2 rounded-l-2xl border-y border-l border-indigo-200 bg-indigo-600 px-3.5 py-3 text-white shadow-2xl backdrop-blur-md active:scale-95 transition-all hover:bg-indigo-700 hover:px-4"
      aria-label={`Accessibility mode text size: ${labels[fontSize]}. Click to change font size.`}
      title="Accessibility Mode (Change Font Size)"
    >
      <div className="flex items-center gap-1.5 font-bold">
        <ZoomIn size={22} className="animate-pulse text-amber-300" />
        <div className="flex flex-col items-start leading-none text-left">
          <span className="text-[10px] uppercase tracking-wider text-indigo-200 font-extrabold">
            A11y
          </span>
          <span className="text-xs font-black tracking-tight">{badgeText[fontSize]}</span>
        </div>
      </div>
    </button>
  );
}
