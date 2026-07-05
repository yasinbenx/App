import type { Surah } from '../../data/types';
import { CardButton } from '../ui/Card';

export function SurahListItem({ surah, onClick }: { surah: Surah; onClick: () => void }) {
  return (
    <CardButton onClick={onClick} className="flex items-center gap-3 px-4 py-3.5">
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
        <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full text-dome-200">
          <polygon points="22,1 40,11 40,33 22,43 4,33 4,11" fill="currentColor" className="opacity-60" />
        </svg>
        <span className="relative text-[12.5px] font-semibold text-dome-700">{surah.id}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14.5px] font-semibold text-ink-900">{surah.nameGerman}</p>
        <p className="truncate text-[12px] text-ink-400">
          {surah.revelationPlace} · {surah.ayahCount} Verse
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="arabic-text text-[19px] leading-none text-dome-700">{surah.nameArabic}</p>
        <p className="mt-1 text-[11px] text-ink-300">{surah.nameTransliteration}</p>
      </div>
    </CardButton>
  );
}
