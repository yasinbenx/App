import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SlidersHorizontal, BookOpen } from 'lucide-react';
import { NavBar } from '../components/layout/NavBar';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { AudioControlBar } from '../components/quran/AudioControlBar';
import { AyahPager } from '../components/quran/AyahPager';
import { ReadingOptionsSheet } from '../components/quran/ReadingOptionsSheet';
import { EmptyState } from '../components/ui/EmptyState';
import { getSurahById } from '../data/surahs';
import { useAppState } from '../state/AppStateContext';
import { useAudioPlayer } from '../state/AudioPlayerContext';

const NO_BASMALA = new Set([1, 9]);

export function SurahDetail() {
  const { surahId } = useParams();
  const [optionsOpen, setOptionsOpen] = useState(false);
  const { readingPrefs, updateReadingPrefs, isAyahBookmarked, toggleBookmarkAyah, setLastRead, lastRead } =
    useAppState();
  const { current, pause, preload, play } = useAudioPlayer();

  const surah = getSurahById(Number(surahId));
  const hasFullContent = (surah?.ayahs?.length ?? 0) > 0;
  const isPartial = hasFullContent && (surah!.ayahs!.length ?? 0) < surah!.ayahCount;

  const initialAyahNumber =
    surah && lastRead?.surahId === surah.id ? lastRead.ayahNumber : surah?.ayahs?.[0]?.number ?? 1;
  const [focusedAyahNumber, setFocusedAyahNumber] = useState(initialAyahNumber);
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!surah) return;
    setLastRead(surah.id, focusedAyahNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surah?.id, focusedAyahNumber]);

  useEffect(() => {
    if (!surah || !hasFullContent) return;
    preload(surah.id, focusedAyahNumber);
    const idx = surah.ayahs!.findIndex((a) => a.number === focusedAyahNumber);
    const next = surah.ayahs![idx + 1];
    const prev = surah.ayahs![idx - 1];
    if (next) preload(surah.id, next.number);
    if (prev) preload(surah.id, prev.number);

    // Swiping away from the playing ayah pauses it — the play button always targets what's visible.
    if (didMountRef.current && current && (current.surahId !== surah.id || current.ayahNumber !== focusedAyahNumber)) {
      pause();
    }
    didMountRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surah?.id, focusedAyahNumber, hasFullContent]);

  const handleWordTap = useCallback(
    (ayahNumber: number) => {
      if (!surah) return;
      play(surah.id, ayahNumber);
    },
    [surah, play],
  );

  if (!surah) {
    return (
      <div className="flex h-full flex-col">
        <NavBar showBack title="Nicht gefunden" />
        <EmptyState icon={<BookOpen size={26} />} title="Sure nicht gefunden" description="Bitte gehe zurück zur Übersicht." />
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      <NavBar
        showBack
        title={surah.nameGerman}
        right={
          hasFullContent && (
            <button
              type="button"
              onClick={() => setOptionsOpen(true)}
              className="tap-highlight-none flex h-9 w-9 items-center justify-center rounded-full text-ink-700 active:bg-sand-200"
              aria-label="Leseoptionen"
            >
              <SlidersHorizontal size={18} strokeWidth={2} />
            </button>
          )
        }
      />

      {hasFullContent ? (
        <>
          <div className="px-5 pb-3 pt-1">
            <div className="mb-3 flex flex-col items-center text-center">
              <p className="arabic-text mb-1 text-[26px] text-dome-700">{surah.nameArabic}</p>
              <p className="text-[12.5px] font-medium text-ink-400">
                {surah.nameTransliteration} · {surah.revelationPlace} · {surah.ayahCount} Verse
              </p>
            </div>
            <AudioControlBar surahId={surah.id} ayahNumber={focusedAyahNumber} />
            {!NO_BASMALA.has(surah.id) && (
              <p className="arabic-text mt-4 text-center text-[19px] leading-relaxed text-dome-700">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            )}
          </div>

          <AyahPager
            ayahs={surah.ayahs!}
            ayahCount={surah.ayahCount}
            fontSize={readingPrefs.fontSize}
            showTransliteration={readingPrefs.showTransliteration}
            showTranslation={readingPrefs.showTranslation}
            isAyahBookmarked={(n) => isAyahBookmarked(surah.id, n)}
            onToggleBookmark={(n) => toggleBookmarkAyah(surah.id, n)}
            onWordTap={handleWordTap}
            initialAyahNumber={initialAyahNumber}
            onFocusedAyahChange={setFocusedAyahNumber}
            trailingNotice={
              isPartial ? (
                <div className="mx-5 rounded-[18px] bg-sand-200/60 px-4 py-4 text-center">
                  <p className="text-[13px] leading-relaxed text-ink-500">
                    Die restlichen {surah.ayahCount - surah.ayahs!.length} Verse dieser Sure werden in einer
                    kommenden Version ergänzt.
                  </p>
                </div>
              ) : undefined
            }
          />
        </>
      ) : (
        <ScreenScroll className="px-5 pb-10 pt-2">
          <div className="mb-6 flex flex-col items-center text-center">
            <p className="arabic-text mb-1 text-[30px] text-dome-700">{surah.nameArabic}</p>
            <p className="text-[13.5px] font-medium text-ink-400">
              {surah.nameTransliteration} · {surah.revelationPlace} · {surah.ayahCount} Verse
            </p>
          </div>
          <EmptyState
            icon={<BookOpen size={26} strokeWidth={1.6} />}
            title="Volltext folgt in Kürze"
            description="Diese Sure wird in einer kommenden Version mit vollständigem Text, Übersetzung und Audio verfügbar sein."
          />
        </ScreenScroll>
      )}

      <ReadingOptionsSheet
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        prefs={readingPrefs}
        onChange={updateReadingPrefs}
      />
    </div>
  );
}
