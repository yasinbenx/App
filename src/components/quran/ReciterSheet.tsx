import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { Reciter } from '../../data/reciters';

export function ReciterSheet({
  open,
  onClose,
  reciters,
  selectedId,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  reciters: Reciter[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <motion.button
            type="button"
            aria-label="Schließen"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-900/35 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-t-[28px] bg-marble-100 px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-3.5 shadow-[0_-12px_32px_rgba(0,0,0,0.18)]"
          >
            <div className="mx-auto mb-4 h-1.5 w-9 rounded-full bg-sand-300" />
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-[17px] font-semibold text-ink-900">Rezitator</h2>
              <button type="button" onClick={onClose} className="tap-highlight-none text-ink-400">
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            <div className="flex flex-col">
              {reciters.map((reciter, i) => {
                const selected = reciter.id === selectedId;
                return (
                  <button
                    key={reciter.id}
                    type="button"
                    onClick={() => {
                      onSelect(reciter.id);
                      onClose();
                    }}
                    className={`tap-highlight-none flex items-center justify-between py-3.5 text-left ${
                      i !== reciters.length - 1 ? 'border-b border-sand-200/80' : ''
                    }`}
                  >
                    <div>
                      <p className="text-[14.5px] font-medium text-ink-900">{reciter.name}</p>
                      {reciter.style && <p className="text-[12px] text-ink-400">{reciter.style}</p>}
                    </div>
                    {selected && <Check size={18} strokeWidth={2.4} className="text-dome-600" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
