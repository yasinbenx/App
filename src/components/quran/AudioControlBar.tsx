import { useState } from 'react';
import { Play, Pause, Loader2, RotateCw, ChevronDown } from 'lucide-react';
import { useAudioPlayer } from '../../state/AudioPlayerContext';
import { getReciterById } from '../../data/reciters';
import { ReciterSheet } from './ReciterSheet';

export function AudioControlBar({ surahId, ayahNumber }: { surahId: number; ayahNumber: number }) {
  const { toggle, statusFor, current, currentTime, duration, rate, cycleRate, reciterId, reciters, setReciter } =
    useAudioPlayer();
  const [reciterOpen, setReciterOpen] = useState(false);

  const status = statusFor(surahId, ayahNumber);
  const isActive = current?.surahId === surahId && current?.ayahNumber === ayahNumber;
  const progress = isActive && duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const reciter = getReciterById(reciterId);

  return (
    <div className="rounded-[20px] border border-gold-300/25 bg-marble-100 px-4 py-3.5 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setReciterOpen(true)}
          className="tap-highlight-none flex min-w-0 items-center gap-1 text-left"
        >
          <span className="truncate text-[12.5px] font-medium text-ink-500">{reciter.name}</span>
          <ChevronDown size={14} className="shrink-0 text-ink-300" strokeWidth={2.2} />
        </button>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={cycleRate}
            className="tap-highlight-none rounded-full bg-sand-200/70 px-2.5 py-1 text-[11.5px] font-semibold text-ink-700 active:scale-95"
            aria-label="Wiedergabegeschwindigkeit ändern"
          >
            {rate}×
          </button>

          <button
            type="button"
            onClick={() => toggle(surahId, ayahNumber)}
            aria-label={status === 'playing' ? 'Pause' : 'Abspielen'}
            className="tap-highlight-none flex h-10 w-10 items-center justify-center rounded-full bg-dome-500 text-marble-50 active:scale-95 disabled:opacity-60"
            disabled={status === 'loading'}
          >
            {status === 'loading' && <Loader2 size={17} className="animate-spin" />}
            {status === 'error' && <RotateCw size={16} />}
            {(status === 'idle' || status === 'paused') && <Play size={17} fill="currentColor" className="ml-0.5" />}
            {status === 'playing' && <Pause size={17} fill="currentColor" />}
          </button>
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand-200">
        <div
          className="h-full rounded-full bg-petrol-400 transition-[width] duration-150 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {status === 'error' && (
        <p className="mt-2 text-[12px] text-ink-400">Audio derzeit nicht verfügbar — bitte erneut versuchen.</p>
      )}

      <ReciterSheet
        open={reciterOpen}
        onClose={() => setReciterOpen(false)}
        reciters={reciters}
        selectedId={reciterId}
        onSelect={setReciter}
      />
    </div>
  );
}
