import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Ayah } from '../../data/types';
import type { ReadingFontSize } from '../../state/AppStateContext';
import { AyahPage } from './AyahPage';

export function AyahPager({
  ayahs,
  ayahCount,
  fontSize,
  showTransliteration,
  showTranslation,
  isAyahBookmarked,
  onToggleBookmark,
  onWordTap,
  initialAyahNumber,
  onFocusedAyahChange,
  trailingNotice,
}: {
  ayahs: Ayah[];
  ayahCount: number;
  fontSize: ReadingFontSize;
  showTransliteration: boolean;
  showTranslation: boolean;
  isAyahBookmarked: (ayahNumber: number) => boolean;
  onToggleBookmark: (ayahNumber: number) => void;
  onWordTap: (ayahNumber: number, wordIndex: number) => void;
  initialAyahNumber: number;
  onFocusedAyahChange: (ayahNumber: number) => void;
  trailingNotice?: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  const didInitRef = useRef(false);
  const pageCount = ayahs.length + (trailingNotice ? 1 : 0);

  const initialIndex = Math.max(0, Math.min(ayahs.length - 1, initialAyahNumber - ayahs[0].number));
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || didInitRef.current) return;
    didInitRef.current = true;
    el.scrollLeft = initialIndex * el.clientWidth;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const commitIndex = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      const ayah = ayahs[index];
      if (ayah) onFocusedAyahChange(ayah.number);
    },
    [ayahs, onFocusedAyahChange],
  );

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = window.setTimeout(() => {
      const width = el.clientWidth || 1;
      commitIndex(Math.round(el.scrollLeft / width));
    }, 90);
  }, [commitIndex]);

  const goToIndex = useCallback(
    (index: number) => {
      const el = containerRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(pageCount - 1, index));
      el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
    },
    [pageCount],
  );

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
      >
        {ayahs.map((ayah) => (
          <div key={ayah.number} className="h-full w-full shrink-0 snap-center">
            <AyahPage
              ayah={ayah}
              ayahCount={ayahCount}
              fontSize={fontSize}
              showTransliteration={showTransliteration}
              showTranslation={showTranslation}
              isBookmarked={isAyahBookmarked(ayah.number)}
              onToggleBookmark={() => onToggleBookmark(ayah.number)}
              onWordTap={(wordIndex) => onWordTap(ayah.number, wordIndex)}
            />
          </div>
        ))}
        {trailingNotice && (
          <div className="flex h-full w-full shrink-0 snap-center items-center">{trailingNotice}</div>
        )}
      </div>

      {currentIndex > 0 && (
        <button
          type="button"
          onClick={() => goToIndex(currentIndex - 1)}
          aria-label="Vorheriger Vers"
          className="tap-highlight-none absolute left-1 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gold-300/25 bg-marble-100/90 text-ink-600 shadow-[var(--shadow-card)] sm:flex"
        >
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>
      )}
      {currentIndex < pageCount - 1 && (
        <button
          type="button"
          onClick={() => goToIndex(currentIndex + 1)}
          aria-label="Nächster Vers"
          className="tap-highlight-none absolute right-1 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gold-300/25 bg-marble-100/90 text-ink-600 shadow-[var(--shadow-card)] sm:flex"
        >
          <ChevronRight size={18} strokeWidth={2.2} />
        </button>
      )}
    </div>
  );
}
