import { Play, Pause, Loader2, RotateCw } from 'lucide-react';
import clsx from 'clsx';
import { useAudioPlayer } from '../../state/AudioPlayerContext';

export function AyahPlayButton({
  surahId,
  ayahNumber,
  size = 'lg',
}: {
  surahId: number;
  ayahNumber: number;
  size?: 'lg' | 'sm';
}) {
  const { toggle, statusFor } = useAudioPlayer();
  const status = statusFor(surahId, ayahNumber);
  const iconSize = size === 'lg' ? 17 : 13;

  return (
    <button
      type="button"
      onClick={() => toggle(surahId, ayahNumber)}
      aria-label={status === 'playing' ? 'Pause' : 'Vers abspielen'}
      disabled={status === 'loading'}
      className={clsx(
        'tap-highlight-none flex shrink-0 items-center justify-center rounded-full active:scale-95 disabled:opacity-60',
        size === 'lg' ? 'h-10 w-10 bg-dome-500 text-marble-50' : 'h-7 w-7 border border-gold-300/25 bg-dome-50 text-dome-600',
      )}
    >
      {status === 'loading' && <Loader2 size={iconSize} className="animate-spin" />}
      {status === 'error' && <RotateCw size={iconSize - 1} />}
      {(status === 'idle' || status === 'paused') && (
        <Play size={iconSize} fill="currentColor" className="ml-0.5" />
      )}
      {status === 'playing' && <Pause size={iconSize} fill="currentColor" />}
    </button>
  );
}
