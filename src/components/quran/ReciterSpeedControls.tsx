import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAudioPlayer } from '../../state/AudioPlayerContext';
import { getReciterById } from '../../data/reciters';
import { ReciterSheet } from './ReciterSheet';

export function ReciterSpeedControls() {
  const { rate, cycleRate, reciterId, reciters, setReciter } = useAudioPlayer();
  const [reciterOpen, setReciterOpen] = useState(false);
  const reciter = getReciterById(reciterId);

  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={() => setReciterOpen(true)}
        className="tap-highlight-none flex min-w-0 items-center gap-1 text-left"
      >
        <span className="truncate text-[12.5px] font-medium text-ink-500">{reciter.name}</span>
        <ChevronDown size={14} className="shrink-0 text-ink-300" strokeWidth={2.2} />
      </button>

      <button
        type="button"
        onClick={cycleRate}
        className="tap-highlight-none shrink-0 rounded-full bg-sand-200/70 px-2.5 py-1 text-[11.5px] font-semibold text-ink-700 active:scale-95"
        aria-label="Wiedergabegeschwindigkeit ändern"
      >
        {rate}×
      </button>

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
