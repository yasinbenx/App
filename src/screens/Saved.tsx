import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark as BookmarkIcon, Heart } from 'lucide-react';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { EmptyState } from '../components/ui/EmptyState';
import { CardButton } from '../components/ui/Card';
import { DuaCard } from '../components/duas/DuaCard';
import { useAppState } from '../state/AppStateContext';
import { getSurahById } from '../data/surahs';
import { getDuaById } from '../data/duas';

type Tab = 'verse' | 'duas';

export function Saved() {
  const [tab, setTab] = useState<Tab>('verse');
  const navigate = useNavigate();
  const { bookmarkedAyahs, favoriteDuaIds, isDuaFavorite } = useAppState();

  const favoriteDuas = favoriteDuaIds.map((id) => getDuaById(id)).filter((d) => !!d);

  return (
    <ScreenScroll className="px-5 pb-10 pt-4">
      <h1 className="font-display mb-4 text-[30px] font-semibold tracking-tight text-ink-900">Gespeichert</h1>

      <div className="mb-5">
        <SegmentedControl<Tab>
          value={tab}
          onChange={setTab}
          options={[
            { value: 'verse', label: `Verse (${bookmarkedAyahs.length})` },
            { value: 'duas', label: `Duas (${favoriteDuas.length})` },
          ]}
        />
      </div>

      {tab === 'verse' ? (
        bookmarkedAyahs.length === 0 ? (
          <EmptyState
            icon={<BookmarkIcon size={24} strokeWidth={1.6} />}
            title="Noch keine Verse gemerkt"
            description="Tippe beim Lesen auf das Lesezeichen-Symbol, um Verse hier zu sammeln."
          />
        ) : (
          <div className="flex flex-col gap-2.5">
            {bookmarkedAyahs.map((b) => {
              const surah = getSurahById(b.surahId);
              const ayah = surah?.ayahs?.find((a) => a.number === b.ayahNumber);
              if (!surah) return null;
              return (
                <CardButton
                  key={`${b.surahId}-${b.ayahNumber}`}
                  onClick={() => navigate(`/quran/${surah.id}`)}
                  className="px-4 py-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[13.5px] font-semibold text-ink-900">
                      {surah.nameGerman} · Vers {b.ayahNumber}
                    </p>
                    <BookmarkIcon size={15} className="fill-gold-400 text-gold-500" />
                  </div>
                  {ayah && (
                    <>
                      <p className="arabic-text mb-1.5 truncate text-[18px] text-dome-700">{ayah.arabic}</p>
                      <p className="line-clamp-2 text-[13px] leading-relaxed text-ink-400">{ayah.translationDe}</p>
                    </>
                  )}
                </CardButton>
              );
            })}
          </div>
        )
      ) : favoriteDuas.length === 0 ? (
        <EmptyState
          icon={<Heart size={24} strokeWidth={1.6} />}
          title="Noch keine Duas gemerkt"
          description="Tippe bei einer Dua auf „Merken“, um sie hier wiederzufinden."
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {favoriteDuas.map(
            (dua) =>
              dua && (
                <DuaCard
                  key={dua.id}
                  dua={dua}
                  isFavorite={isDuaFavorite(dua.id)}
                  onClick={() => navigate(`/duas/${dua.categoryId}/${dua.id}`)}
                />
              ),
          )}
        </div>
      )}
    </ScreenScroll>
  );
}
