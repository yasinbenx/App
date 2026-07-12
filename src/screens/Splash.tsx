import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

export function Splash() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full flex-col items-center justify-between overflow-hidden bg-sand-100 px-8 pb-10 pt-16">
      <ArchBackdrop />

      <div className="relative z-10 flex-1" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <Emblem />
        <p className="mt-5 text-[14.5px] font-medium tracking-wide text-ink-400">Asalamu Alaykum</p>
        <h1 className="mt-1.5 font-display text-[40px] font-semibold tracking-tight text-dome-700">Quba</h1>
        <p className="mt-3 max-w-[240px] text-[15px] leading-relaxed text-ink-500">
          Ruhe finden im Alltag — mit dem Qur’an, Duas und täglichen Erinnerungen.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex w-full flex-1 flex-col justify-end gap-3"
      >
        <Button size="lg" className="w-full" onClick={() => navigate('/onboarding')}>
          Loslegen
        </Button>
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="tap-highlight-none py-2 text-[13.5px] font-medium text-ink-400"
        >
          Später erkunden
        </button>
      </motion.div>
    </div>
  );
}

function Emblem() {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-gradient-to-br from-dome-500 to-dome-700 shadow-[0_16px_32px_-12px_rgba(63,92,68,0.5)]">
      <svg width="36" height="36" viewBox="0 0 44 44" fill="none">
        <mask id="emblem-crescent">
          <rect width="44" height="44" fill="#000" />
          <circle cx="21" cy="23" r="14" fill="#fff" />
          <circle cx="27.5" cy="17" r="12.5" fill="#000" />
        </mask>
        <circle cx="21" cy="23" r="14" fill="#F6EFE1" mask="url(#emblem-crescent)" />
        <path
          d="M31.5,7c.5,2.3,2,3.8,4.3,4.3-2.3.5-3.8,2-4.3,4.3-.5-2.3-2-3.8-4.3-4.3,2.3-.5,3.8-2,4.3-4.3Z"
          fill="#DCBC7E"
        />
      </svg>
    </div>
  );
}

function ArchBackdrop() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[62%] w-full text-dome-500/[0.07]"
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
    >
      <path
        d="M0 500V260c0-88 89-160 200-160s200 72 200 160v240"
        stroke="currentColor"
        strokeWidth="26"
      />
      <path
        d="M60 500V300c0-62 63-112 140-112s140 50 140 112v200"
        stroke="currentColor"
        strokeWidth="14"
      />
    </svg>
  );
}
