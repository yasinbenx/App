import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { SegmentedControl } from '../ui/SegmentedControl';
import { ToggleRow } from '../ui/ToggleRow';
import type { ReadingFontSize, ReadingPrefs } from '../../state/AppStateContext';

export function ReadingOptionsSheet({
  open,
  onClose,
  prefs,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  prefs: ReadingPrefs;
  onChange: (prefs: Partial<ReadingPrefs>) => void;
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
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-[17px] font-semibold text-ink-900">Leseoptionen</h2>
              <button type="button" onClick={onClose} className="tap-highlight-none text-ink-400">
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            <p className="mb-2 text-[12.5px] font-semibold uppercase tracking-wide text-ink-400">Schriftgröße</p>
            <div className="mb-5">
              <SegmentedControl<ReadingFontSize>
                value={prefs.fontSize}
                onChange={(fontSize) => onChange({ fontSize })}
                options={[
                  { value: 'klein', label: 'Klein' },
                  { value: 'mittel', label: 'Mittel' },
                  { value: 'gross', label: 'Groß' },
                ]}
              />
            </div>

            <ToggleRow
              title="Transliteration anzeigen"
              subtitle="Lateinische Lautschrift"
              checked={prefs.showTransliteration}
              onChange={(v) => onChange({ showTransliteration: v })}
            />
            <ToggleRow
              title="Übersetzung anzeigen"
              subtitle="Deutsche Bedeutung"
              checked={prefs.showTranslation}
              onChange={(v) => onChange({ showTranslation: v })}
              last
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
