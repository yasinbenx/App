import { useNavigate } from 'react-router-dom';
import { Settings2 } from 'lucide-react';
import { NavBar } from '../components/layout/NavBar';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { ReminderCard } from '../components/reminder/ReminderCard';
import { REMINDERS } from '../data/reminders';
import type { ReminderSlot } from '../data/types';

const SLOTS: ReminderSlot[] = ['Morgen', 'Nachmittag', 'Abend'];

export function Reminder() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col">
      <NavBar
        showBack
        title="Erinnerungen"
        right={
          <button
            type="button"
            onClick={() => navigate('/reminder/einstellungen')}
            className="tap-highlight-none flex h-9 w-9 items-center justify-center rounded-full text-ink-700 active:bg-sand-200"
            aria-label="Reminder-Einstellungen"
          >
            <Settings2 size={18} strokeWidth={2} />
          </button>
        }
      />
      <ScreenScroll className="px-5 pb-10 pt-2">
        <p className="mb-5 text-[13.5px] leading-relaxed text-ink-400">
          Sanfte Impulse für deinen Tag — Verse, Hadithe und Duas zu Morgen, Nachmittag und Abend.
        </p>

        {SLOTS.map((slot) => {
          const items = REMINDERS.filter((r) => r.slot === slot);
          return (
            <div key={slot} className="mb-6 last:mb-0">
              <p className="mb-3 text-[12.5px] font-semibold uppercase tracking-wide text-ink-400">{slot}</p>
              <div className="flex flex-col gap-3">
                {items.map((reminder) => (
                  <ReminderCard key={reminder.id} reminder={reminder} />
                ))}
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => navigate('/reminder/einstellungen')}
          className="tap-highlight-none w-full rounded-full border border-dome-200 py-3.5 text-[14px] font-semibold text-dome-600 active:scale-[0.98]"
        >
          Reminder-Einstellungen bearbeiten
        </button>
      </ScreenScroll>
    </div>
  );
}
