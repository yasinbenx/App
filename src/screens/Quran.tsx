import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { SearchBar } from '../components/ui/SearchBar';
import { Chip } from '../components/ui/Chip';
import { SurahListItem } from '../components/quran/SurahListItem';
import { EmptyState } from '../components/ui/EmptyState';
import { SURAHS } from '../data/surahs';
import { BookX } from 'lucide-react';

type Filter = 'alle' | 'Mekka' | 'Medina';

export function Quran() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('alle');

  const filtered = useMemo(() => {
    return SURAHS.filter((s) => {
      const matchesFilter = filter === 'alle' || s.revelationPlace === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        s.nameGerman.toLowerCase().includes(q) ||
        s.nameTransliteration.toLowerCase().includes(q) ||
        String(s.id).includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <div className="flex h-full flex-col">
      <ScreenScroll className="px-5 pb-8 pt-3">
        <h1 className="font-display mb-4 text-[30px] font-semibold tracking-tight text-ink-900">Qur’an</h1>

        <div className="mb-3.5">
          <SearchBar value={query} onChange={setQuery} placeholder="Sure suchen" />
        </div>

        <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
          <Chip active={filter === 'alle'} onClick={() => setFilter('alle')}>
            Alle 114
          </Chip>
          <Chip active={filter === 'Mekka'} onClick={() => setFilter('Mekka')}>
            Mekkanisch
          </Chip>
          <Chip active={filter === 'Medina'} onClick={() => setFilter('Medina')}>
            Medinensisch
          </Chip>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<BookX size={26} strokeWidth={1.6} />}
            title="Keine Sure gefunden"
            description="Versuche einen anderen Suchbegriff oder Filter."
          />
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((surah) => (
              <SurahListItem key={surah.id} surah={surah} onClick={() => navigate(`/quran/${surah.id}`)} />
            ))}
          </div>
        )}
      </ScreenScroll>
    </div>
  );
}
