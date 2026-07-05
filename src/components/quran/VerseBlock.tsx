import { Bookmark } from 'lucide-react';
import clsx from 'clsx';
import type { Ayah } from '../../data/types';
import type { ReadingFontSize } from '../../state/AppStateContext';

const ARABIC_SIZE: Record<ReadingFontSize, string> = {
  klein: 'text-[23px] leading-[2.15]',
  mittel: 'text-[27px] leading-[2.15]',
  gross: 'text-[32px] leading-[2.1]',
};

export function VerseBlock({
  ayah,
  fontSize,
  showTransliteration,
  showTranslation,
  isBookmarked,
  onToggleBookmark,
}: {
  ayah: Ayah;
  fontSize: ReadingFontSize;
  showTransliteration: boolean;
  showTranslation: boolean;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}) {
  return (
    <div className="border-b border-sand-200/70 py-6 first:pt-2 last:border-b-0">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gold-400/50 text-[10.5px] font-semibold text-gold-500">
          {ayah.number}
        </div>
        <button
          type="button"
          onClick={onToggleBookmark}
          aria-label="Vers merken"
          className="tap-highlight-none text-ink-300 active:scale-90"
        >
          <Bookmark
            size={18}
            strokeWidth={2}
            className={isBookmarked ? 'fill-gold-400 text-gold-500' : ''}
          />
        </button>
      </div>

      <p className={clsx('arabic-text mb-4 text-right font-normal text-ink-900', ARABIC_SIZE[fontSize])}>
        {ayah.arabic}
      </p>

      {showTransliteration && (
        <p className="mb-2 text-[13.5px] italic leading-relaxed text-ink-400">{ayah.transliteration}</p>
      )}
      {showTranslation && (
        <p className="text-[14.5px] leading-relaxed text-ink-700">{ayah.translationDe}</p>
      )}
    </div>
  );
}
