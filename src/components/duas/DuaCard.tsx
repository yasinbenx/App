import { ChevronRight, Heart } from 'lucide-react';
import { CardButton } from '../ui/Card';
import type { Dua } from '../../data/types';

export function DuaCard({
  dua,
  onClick,
  isFavorite,
}: {
  dua: Dua;
  onClick: () => void;
  isFavorite?: boolean;
}) {
  return (
    <CardButton onClick={onClick} className="px-4 py-4">
      <div className="mb-2.5 flex items-start justify-between gap-3">
        <p className="text-[15px] font-semibold text-ink-900">{dua.title}</p>
        <div className="flex shrink-0 items-center gap-2 pt-0.5 text-ink-300">
          {isFavorite && <Heart size={15} className="fill-gold-400 text-gold-500" />}
          <ChevronRight size={16} strokeWidth={2.2} />
        </div>
      </div>
      <p className="arabic-text mb-2 truncate text-[19px] text-dome-700">{dua.arabic}</p>
      <p className="line-clamp-2 text-[13px] leading-relaxed text-ink-400">{dua.translationDe}</p>
    </CardButton>
  );
}
