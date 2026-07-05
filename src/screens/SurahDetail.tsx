import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SlidersHorizontal, BookOpen } from 'lucide-react';
import { NavBar } from '../components/layout/NavBar';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { AudioPlayerBar } from '../components/quran/AudioPlayerBar';
import { VerseBlock } from '../components/quran/VerseBlock';
import { ReadingOptionsSheet } from '../components/quran/ReadingOptionsSheet';
import { EmptyState } from '../components/ui/EmptyState';
import { getSurahById } from '../data/surahs';
import { useAppState } from '../state/AppStateContext';

const NO_BASMALA = new Set([1, 9]);

export function SurahDetail() {
  const { surahId } = useParams();
  const [optionsOpen, setOptionsOpen] = useState(false);
  const { readingPrefs, updateReadingPrefs, isAyahBookmarked, toggleBookmarkAyah, setLastRead } = useAppState();

  const surah = getSurahById(Number(surahId));

  useEffect(() => {
    if (surah) setLastRead(surah.id, surah.ayahs?.[0]?.number ?? 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surah?.id]);

  if (!surah) {
    return (
      <div className="flex h-full flex-col">
        <NavBar showBack title="Nicht gefunden" />
        <EmptyState icon={<BookOpen size={26} />} title="Sure nicht gefunden" description="Bitte gehe zurück zur Übersicht." />
      </div>
    );
  }

  const hasFullContent = (surah.ayahs?.length ?? 0) > 0;
  const isPartial = hasFullContent && (surah.ayahs?.length ?? 0) < surah.ayahCount;

  return (
    <div className="relative flex h-full flex-col">
      <NavBar
        showBack
        title={surah.nameGerman}
        right={
          <button
            type="button"
            onClick={() => setOptionsOpen(true)}
            className="tap-highlight-none flex h-9 w-9 items-center justify-center rounded-full text-ink-700 active:bg-sand-200"
            aria-label="Leseoptionen"
          >
            <SlidersHorizontal size={18} strokeWidth={2} />
          </button>
        }
      />

      <ScreenScroll className="px-5 pb-10 pt-2">
        <div className="mb-6 flex flex-col items-center text-center">
          <p className="arabic-text mb-1 text-[30px] text-dome-700">{surah.nameArabic}</p>
          <p className="text-[13.5px] font-medium text-ink-400">
            {surah.nameTransliteration} · {surah.revelationPlace} · {surah.ayahCount} Verse
          </p>
        </div>

        <div className="mb-5">
          <AudioPlayerBar />
        </div>

        {!NO_BASMALA.has(surah.id) && (
          <p className="arabic-text mb-6 text-center text-[22px] leading-relaxed text-dome-700">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        )}

        {hasFullContent ? (
          <div>
            {surah.ayahs!.map((ayah) => (
              <VerseBlock
                key={ayah.number}
                ayah={ayah}
                fontSize={readingPrefs.fontSize}
                showTransliteration={readingPrefs.showTransliteration}
                showTranslation={readingPrefs.showTranslation}
                isBookmarked={isAyahBookmarked(surah.id, ayah.number)}
                onToggleBookmark={() => toggleBookmarkAyah(surah.id, ayah.number)}
              />
            ))}
            {isPartial && (
              <div className="mt-2 rounded-[18px] bg-sand-200/60 px-4 py-4 text-center">
                <p className="text-[13px] leading-relaxed text-ink-500">
                  Die restlichen {surah.ayahCount - surah.ayahs!.length} Verse dieser Sure werden in einer
                  kommenden Version ergänzt.
                </p>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpen size={26} strokeWidth={1.6} />}
            title="Volltext folgt in Kürze"
            description="Diese Sure wird in einer kommenden Version mit vollständigem Text, Übersetzung und Audio verfügbar sein."
          />
        )}
      </ScreenScroll>

      <ReadingOptionsSheet
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        prefs={readingPrefs}
        onChange={updateReadingPrefs}
      />
    </div>
  );
}
