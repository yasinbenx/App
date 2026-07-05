import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export function AudioPlayerBar({ reciter = 'Scheich Mishary Al-Afasy' }: { reciter?: string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(28);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = window.setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 0.6));
      }, 200);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing]);

  return (
    <div className="rounded-[20px] border border-gold-300/25 bg-marble-100 px-4 py-3.5 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold text-ink-900">Rezitation</p>
          <p className="text-[11.5px] text-ink-400">{reciter}</p>
        </div>
        <div className="flex items-center gap-3.5 text-dome-600">
          <button type="button" className="tap-highlight-none active:scale-90" aria-label="Vorheriger Vers">
            <SkipBack size={18} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause' : 'Abspielen'}
            className="tap-highlight-none flex h-10 w-10 items-center justify-center rounded-full bg-dome-500 text-marble-50 active:scale-95"
          >
            {playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" className="ml-0.5" />}
          </button>
          <button type="button" className="tap-highlight-none active:scale-90" aria-label="Nächster Vers">
            <SkipForward size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand-200">
        <div
          className="h-full rounded-full bg-petrol-400 transition-[width] duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
