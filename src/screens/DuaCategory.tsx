import { useNavigate, useParams } from 'react-router-dom';
import { Hand } from 'lucide-react';
import { NavBar } from '../components/layout/NavBar';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { EmptyState } from '../components/ui/EmptyState';
import { DuaCard } from '../components/duas/DuaCard';
import { getCategoryById, getDuasByCategory } from '../data/duas';
import { useAppState } from '../state/AppStateContext';

export function DuaCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { isDuaFavorite } = useAppState();

  const category = getCategoryById(categoryId ?? '');
  const duas = getDuasByCategory(categoryId ?? '');

  return (
    <div className="flex h-full flex-col">
      <NavBar showBack title={category?.title ?? 'Duas'} />
      <ScreenScroll className="px-5 pb-10 pt-2">
        {category && <p className="mb-4 text-[13.5px] leading-relaxed text-ink-400">{category.subtitle}</p>}
        {duas.length === 0 ? (
          <EmptyState icon={<Hand size={24} strokeWidth={1.6} />} title="Keine Duas" description="In dieser Kategorie sind noch keine Duas hinterlegt." />
        ) : (
          <div className="flex flex-col gap-2.5">
            {duas.map((dua) => (
              <DuaCard
                key={dua.id}
                dua={dua}
                isFavorite={isDuaFavorite(dua.id)}
                onClick={() => navigate(`/duas/${categoryId}/${dua.id}`)}
              />
            ))}
          </div>
        )}
      </ScreenScroll>
    </div>
  );
}
