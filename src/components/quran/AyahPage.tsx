import { Bookmark } from 'lucide-react';
import clsx from 'clsx';
import type { Ayah } from '../../data/types';
import type { ReadingFontSize } from '../../state/AppStateContext';
import { getWordSegments } from '../../lib/wordSegments';

const ARABIC_SIZE: Record<ReadingFontSize, string> = {
  klein: 'text-[25px] leading-[2.3]',
  mittel: 'text-[29px] leading-[2.3]',
  gross: 'text-[34px] leading-[2.25]',
};

export function AyahPage({
  ayah,
  ayahCount,
  fontSize,
  showTransliteration,
  showTranslation,
  isBookmarked,
  onToggleBookmark,
  onWordTap,
}: {
  ayah: Ayah;
  ayahCount: number;
  fontSize: ReadingFontSize;
  showTransliteration: boolean;
  showTranslation: boolean;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onWordTap: (wordIndex: number) => void;
}) {
  const words = getWordSegments(ayah.arabic);

  return (
    <div className="flex h-full w-full shrink-0 snap-center flex-col px-5" role="group" aria-roledescription="slide">
      <div className="flex items-center justify-between pt-1">
        <div className="flex h-6 items-center gap-1.5 rounded-full border border-gold-400/50 px-2.5 text-[10.5px] font-semibold text-gold-500">
          {ayah.number} / {ayahCount}
        </div>
        <button
          type="button"
          onClick={onToggleBookmark}
          aria-label="Vers merken"
          className="tap-highlight-none text-ink-300 active:scale-90"
        >
          <Bookmark size={19} strokeWidth={2} className={isBookmarked ? 'fill-gold-400 text-gold-500' : ''} />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <p dir="rtl" className={clsx('arabic-text mb-5 flex flex-wrap justify-center gap-x-2.5 text-right font-normal text-ink-900', ARABIC_SIZE[fontSize])}>
          {words.map((w) => (
            <span
              key={w.index}
              onClick={() => onWordTap(w.index)}
              className="tap-highlight-none cursor-pointer rounded-md transition-colors active:bg-dome-100"
            >
              {w.text}
            </span>
          ))}
        </p>

        {showTransliteration && (
          <p className="mb-2 text-center text-[13.5px] italic leading-relaxed text-ink-400">{ayah.transliteration}</p>
        )}
        {showTranslation && (
          <p className="text-center text-[14.5px] leading-relaxed text-ink-700">{ayah.translationDe}</p>
        )}
      </div>

      <p className="pb-1 text-center text-[11px] leading-relaxed text-ink-300">
        Wort antippen: aktuell wird der ganze Vers abgespielt — wortgenaue Wiedergabe folgt in einer kommenden Version.
      </p>
    </div>
  );
}
