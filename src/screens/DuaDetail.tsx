import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Share2, Hand, Check } from 'lucide-react';
import { NavBar } from '../components/layout/NavBar';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { getDuaById } from '../data/duas';
import { useAppState } from '../state/AppStateContext';

export function DuaDetail() {
  const { duaId } = useParams();
  const [copied, setCopied] = useState(false);
  const { isDuaFavorite, toggleFavoriteDua } = useAppState();

  const dua = getDuaById(duaId ?? '');

  if (!dua) {
    return (
      <div className="flex h-full flex-col">
        <NavBar showBack title="Dua" />
        <EmptyState icon={<Hand size={24} />} title="Dua nicht gefunden" description="Bitte gehe zurück zur Übersicht." />
      </div>
    );
  }

  const favorite = isDuaFavorite(dua.id);

  const handleShare = async () => {
    const text = `${dua.title}\n\n${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translationDe}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable in this environment — no-op
    }
  };

  return (
    <div className="flex h-full flex-col">
      <NavBar showBack title={dua.title} />
      <ScreenScroll className="px-5 pb-10 pt-2">
        <Card className="px-5 py-7">
          <p className="arabic-text mb-6 text-center text-[26px] leading-[1.9] text-dome-700">{dua.arabic}</p>
          <div className="mx-auto mb-5 h-px w-10 bg-gold-300/60" />
          <p className="mb-4 text-center text-[14px] italic leading-relaxed text-ink-400">{dua.transliteration}</p>
          <p className="text-center text-[15px] leading-relaxed text-ink-800">{dua.translationDe}</p>
        </Card>

        {dua.source && (
          <div className="mt-4 flex items-center justify-center">
            <span className="rounded-full bg-sand-200/70 px-3.5 py-1.5 text-[12px] font-medium text-ink-500">
              Quelle: {dua.source}
            </span>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => toggleFavoriteDua(dua.id)}
            className="tap-highlight-none flex flex-1 items-center justify-center gap-2 rounded-full bg-dome-500 py-3.5 text-[14px] font-semibold text-marble-50 active:scale-[0.98]"
          >
            <Heart size={16} className={favorite ? 'fill-marble-50' : ''} strokeWidth={2} />
            {favorite ? 'Gemerkt' : 'Merken'}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="tap-highlight-none flex flex-1 items-center justify-center gap-2 rounded-full border border-gold-300/30 bg-marble-100 py-3.5 text-[14px] font-semibold text-ink-700 active:scale-[0.98]"
          >
            {copied ? <Check size={16} strokeWidth={2.2} /> : <Share2 size={16} strokeWidth={2} />}
            {copied ? 'Kopiert' : 'Teilen'}
          </button>
        </div>
      </ScreenScroll>
    </div>
  );
}
