import { BookOpen, Quote, HandHeart } from 'lucide-react';
import clsx from 'clsx';
import type { Reminder } from '../../data/types';
import { Card } from '../ui/Card';

const TYPE_META: Record<Reminder['type'], { label: string; icon: typeof BookOpen }> = {
  vers: { label: 'Vers', icon: BookOpen },
  hadith: { label: 'Hadith', icon: Quote },
  dua: { label: 'Dua', icon: HandHeart },
};

export function ReminderCard({ reminder, featured }: { reminder: Reminder; featured?: boolean }) {
  const meta = TYPE_META[reminder.type];
  const Icon = meta.icon;

  return (
    <Card
      className={clsx(
        'px-5 py-5',
        featured && 'border-dome-200/60 bg-gradient-to-br from-dome-500 to-dome-600 text-marble-50 shadow-[0_16px_32px_-14px_rgba(63,92,68,0.55)]',
      )}
    >
      <div className="mb-3.5 flex items-center gap-2">
        <div
          className={clsx(
            'flex h-7 w-7 items-center justify-center rounded-full',
            featured ? 'bg-marble-50/15 text-marble-50' : 'bg-dome-50 text-dome-600',
          )}
        >
          <Icon size={14} strokeWidth={2.2} />
        </div>
        <span
          className={clsx(
            'text-[11.5px] font-semibold uppercase tracking-wide',
            featured ? 'text-marble-50/80' : 'text-ink-400',
          )}
        >
          {meta.label} · {reminder.slot}
        </span>
      </div>

      {reminder.arabic && (
        <p className={clsx('arabic-text mb-3 text-[21px] leading-relaxed', featured ? 'text-marble-50' : 'text-dome-700')}>
          {reminder.arabic}
        </p>
      )}

      <p className={clsx('text-[14.5px] leading-relaxed', featured ? 'text-marble-50/95' : 'text-ink-700')}>
        {reminder.textDe}
      </p>

      <p className={clsx('mt-3 text-[12px] font-medium', featured ? 'text-marble-50/70' : 'text-ink-400')}>
        {reminder.source}
      </p>
    </Card>
  );
}
