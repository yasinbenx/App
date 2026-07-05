import { useNavigate } from 'react-router-dom';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { CardButton } from '../components/ui/Card';
import { DUA_CATEGORIES, getDuasByCategory } from '../data/duas';
import { DUA_CATEGORY_ICONS } from '../data/icons';

export function Duas() {
  const navigate = useNavigate();

  return (
    <ScreenScroll className="px-5 pb-10 pt-3">
      <h1 className="font-display mb-1.5 text-[30px] font-semibold tracking-tight text-ink-900">Duas</h1>
      <p className="mb-5 text-[14px] leading-relaxed text-ink-400">
        Bittgebete für Alltag, Reisen und besondere Momente.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {DUA_CATEGORIES.map((category) => {
          const Icon = DUA_CATEGORY_ICONS[category.icon];
          const count = getDuasByCategory(category.id).length;
          return (
            <CardButton
              key={category.id}
              onClick={() => navigate(`/duas/${category.id}`)}
              className="flex flex-col gap-3.5 px-4 py-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-petrol-400/10 text-petrol-500">
                <Icon size={18} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[14.5px] font-semibold text-ink-900">{category.title}</p>
                <p className="mt-0.5 text-[11.5px] leading-snug text-ink-400">{category.subtitle}</p>
              </div>
              <span className="text-[11px] font-medium text-dome-500">{count} Duas</span>
            </CardButton>
          );
        })}
      </div>
    </ScreenScroll>
  );
}
