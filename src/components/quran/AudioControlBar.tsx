import { useAudioPlayer } from '../../state/AudioPlayerContext';
import { AyahPlayButton } from './AyahPlayButton';
import { ReciterSpeedControls } from './ReciterSpeedControls';

export function AudioControlBar({ surahId, ayahNumber }: { surahId: number; ayahNumber: number }) {
  const { statusFor, current, currentTime, duration } = useAudioPlayer();

  const status = statusFor(surahId, ayahNumber);
  const isActive = current?.surahId === surahId && current?.ayahNumber === ayahNumber;
  const progress = isActive && duration > 0 ? Math.min(1, currentTime / duration) : 0;

  return (
    <div className="rounded-[20px] border border-gold-300/25 bg-marble-100 px-4 py-3.5 shadow-[var(--shadow-card)]">
      <div className="mb-3 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <ReciterSpeedControls />
        </div>
        <AyahPlayButton surahId={surahId} ayahNumber={ayahNumber} size="lg" />
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
    </div>
  );
}
