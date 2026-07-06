import type { ReactNode } from 'react';
import { ScreenScroll } from '../layout/ScreenScroll';
import { Card } from '../ui/Card';
import type { Ayah } from '../../data/types';
import type { ReadingFontSize } from '../../state/AppStateContext';
import { ReciterSpeedControls } from './ReciterSpeedControls';
import { AyahRow } from './AyahRow';

export function ClassicReader({
  surahId,
  ayahs,
  fontSize,
  showTransliteration,
  showTranslation,
  showBismillah,
  isAyahBookmarked,
  onToggleBookmark,
  trailingNotice,
}: {
  surahId: number;
  ayahs: Ayah[];
  fontSize: ReadingFontSize;
  showTransliteration: boolean;
  showTranslation: boolean;
  showBismillah: boolean;
  isAyahBookmarked: (ayahNumber: number) => boolean;
  onToggleBookmark: (ayahNumber: number) => void;
  trailingNotice?: ReactNode;
}) {
  return (
    <ScreenScroll className="px-5 pb-10 pt-1">
      <Card className="mb-5 px-4 py-3">
        <ReciterSpeedControls />
      </Card>

      {showBismillah && (
        <p className="arabic-text mb-4 text-center text-[22px] leading-relaxed text-dome-700">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      )}

      <div>
        {ayahs.map((ayah) => (
          <AyahRow
            key={ayah.number}
            ayah={ayah}
            surahId={surahId}
            fontSize={fontSize}
            showTransliteration={showTransliteration}
            showTranslation={showTranslation}
            isBookmarked={isAyahBookmarked(ayah.number)}
            onToggleBookmark={() => onToggleBookmark(ayah.number)}
          />
        ))}
      </div>

      {trailingNotice}
    </ScreenScroll>
  );
}
